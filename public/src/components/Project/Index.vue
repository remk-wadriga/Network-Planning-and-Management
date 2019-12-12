<template src="@/templates/project/index.html" />

<script>
    import Graph from "@/components/Graph";

export default {
    name: 'Index',
    components: { Graph },
    data () {
        return {
            tasks: {},
            ranges: {},
            events: {},
            eventIndex: 1,
            eventsFrom: {},
            stringData: '1\n' +
                '2\n' +
                '3 1\n' +
                '4 1\n' +
                '5 2\n' +
                '6 2\n' +
                '7 2\n' +
                '8 3\n' +
                '9 4,5\n' +
                '10 6\n' +
                '11 6\n' +
                '12 7\n' +
                '13 8,9\n' +
                '14 10\n' +
                '15 11,12',
            /*stringData: '1\n' +
                '2\n' +
                '3 1\n' +
                '4 1\n' +
                '5 2\n' +
                '6 2\n' +
                '7 3\n' +
                '8 4,5\n' +
                '9 6',*/
            /*stringData: '4 1\n' +
                '9 6\n' +
                '2\n' +
                '7 3\n' +
                '3 1\n' +
                '6 2\n' +
                '8 5,4\n' +
                '5 2\n' +
                '1',*/
            showGraph: false,
            projectData: []
        }
    },
    methods: {
        buildGraph () {
            if (!this.stringData) {
                return false
            }

            this.showGraph = false
            this.projectData = []

            this.buildTasks()
            this.buildRanges()
            this.buildTmpEvents()
            this.buildEvents()
            this.setupEventsRelations()

            Object.keys(this.events).forEach(id => {
                this.events[id].children.forEach(toID => {
                    if (typeof id === 'string') {
                        id = parseInt(id)
                    }
                    this.projectData.push([id, toID])
                })
            })

            this.showGraph = this.projectData.length > 0
        },
        getTaskRange (task) {
            if (task.range > 0) {
                return task.range
            }
            let maxRange = 1
            task.relations.forEach(id => {
                let range = this.getTaskRange(this.tasks[id]) + 1
                if (range > maxRange) {
                    maxRange = range
                }
            })
            return maxRange
        },
        buildTasks () {
            this.stringData.split("\n").forEach(row => {
                let rowParts = row.split(' ')
                if (rowParts.length > 0) {
                    let task = {
                        id: rowParts[0],
                        range: 0,
                        relations: []
                    }
                    if (typeof task.id === 'string') {
                        task.id = parseInt(task.id)
                    }
                    if (rowParts.length === 2) {
                        rowParts[1].split(',').forEach(id => {
                            task.relations.push(parseInt(id))
                        })
                    }
                    this.tasks[task.id] = task
                }
            })
        },
        buildRanges () {
            Object.keys(this.tasks).forEach(id => {
                let task = this.tasks[id]
                task.range = this.getTaskRange(task)
                if (this.ranges[task.range] === undefined) {
                    this.ranges[task.range] = []
                }
                this.ranges[task.range].push(task)
            })
        },
        buildTmpEvents () {
            for (let range = 1; range <= Object.keys(this.ranges).length; range++) {
                this.ranges[range].forEach(task => {
                    if (task.relations.length > 0) {
                        task.relations.forEach(id => {
                            let event = this.createEvent(id, task.id)
                            this.events[event.id] = event
                        })
                    } else {
                        let event = this.createEvent(0, task.id)
                        this.events[event.id] = event
                    }
                })
            }
        },
        buildEvents () {
            // Create events
            let eventIndex = 1
            let events = {}
            let parentsTasks = []
            Object.keys(this.events).forEach(id => {
                let event = this.events[id]
                parentsTasks.push(event.parent)
                let children = event.children.sort()
                let childrenIndexes = children.join(':')
                if (events[childrenIndexes] === undefined) {
                    events[childrenIndexes] = {
                        id: eventIndex++,
                        parents: [],
                        children: children
                    }
                }
                events[childrenIndexes].parents.push(event.parent)
            })

            // Add last event
            let parents = []
            this.arrayDiff(Object.keys(this.tasks), parentsTasks).forEach(id => {
                if (typeof id === 'string') {
                    id = parseInt(id)
                }
                if (id !== 0) {
                    parents.push(id)
                }
            })
            if (parents.length > 0) {
                events[parents.join(':')] = {
                    id: eventIndex++,
                    parents: parents,
                    children: []
                }
            }

            // Order events by ID
            this.events = {}
            let tmpEvents = {}
            Object.keys(events).forEach(index => {
                let event = events[index]
                tmpEvents[event.id] = event
            })
            for (let i = 1; i < eventIndex; i++) {
                this.events[i] = tmpEvents[i]
            }
        },
        setupEventsRelations () {
            // Set children
            Object.keys(this.events).forEach(id => {
                let event = this.events[id]
                event.children = this.findChildrenByTasks(event.children)
            })
            // Clear parents tasks
            Object.keys(this.events).forEach(id => {
                this.events[id].parents = []
            })
            // Set events IDs to parents
            Object.keys(this.events).forEach(id => {
                this.events[id].children.forEach(childID => {
                    if (typeof id === 'string') {
                        id = parseInt(id)
                    }
                    this.events[childID].parents.push(id)
                })
            })
        },
        findChildrenByTasks(tasks) {
            let children = []
            Object.keys(this.events).forEach(id => {
                this.events[id].parents.forEach(parentID => {
                    tasks.forEach(taskID => {
                        if (parentID === taskID) {
                            if (typeof id === 'string') {
                                id = parseInt(id)
                            }
                            children.push(id)
                        }
                    })
                })
            })
            return children
        },
        createEvent (formID, toID) {
            if (this.eventsFrom[formID] === undefined) {
                this.eventsFrom[formID] = {
                    id: this.eventIndex++,
                    parent: formID,
                    children: []
                }
            }
            this.eventsFrom[formID]['children'].push(toID)

            return this.eventsFrom[formID]
        },
        arrayDiff (a1, a2) {
            let a = [], diff = []
            for (let i = 0; i < a1.length; i++) {
                a[a1[i]] = true
            }
            for (let i = 0; i < a2.length; i++) {
                if (a[a2[i]]) {
                    delete a[a2[i]]
                } else {
                    a[a2[i]] = true
                }
            }
            for (let k in a) {
                diff.push(k)
            }
            return diff
        }
    },
    mounted() {

    }
}
</script>

<style scoped>
</style>
