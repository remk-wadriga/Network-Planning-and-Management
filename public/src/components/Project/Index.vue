<template src="@/templates/project/index.html" />

<script>
    import Graph from "@/components/Graph"
    import Task from "@/entities/Task"
    import Event from "@/entities/Event"

    export default {
        name: "Index",
        components: { Graph },
        data () {
            return {
                data: '',
                tasksStack: {},
                eventsStack: {},
                events: []
            }
        },
        methods: {
            buildGraph () {
                // Build graph only if we have got the data
                if (!this.data) {
                    return
                }

                // Clear old events and stacks
                this.tasksStack = {}
                this.eventsStack = {}
                this.events = []

                // Parse string data and create from it the task with relations and the events
                this.parseData()

                // Join events by "in" tasks
                this.joinEvents()

                // Set up events hierarchy ("child-to-parent" relations)
                this.setupEventsHierarchy()

                // Order events by "ranges" (position in hierarchy)
                this.orderEvents()

                // Write ordered events from stack to output param
                let tmpEVents = []
                Object.keys(this.eventsStack).forEach(id => {
                    tmpEVents.push(this.eventsStack[id])
                })
                this.events = tmpEVents
            },
            parseData () {
                // Create temporary stack to remember the parents IDs for each task
                let parentStack = {}
                this.data.split("\n").forEach(row => {
                    let rowParts = row.split(' ')
                    if (rowParts.length > 0) {
                        let id = rowParts[0]
                        if (parentStack[id] === undefined) {
                            parentStack[id] = []
                        }
                        // Add task parents IDs to temporary stack
                        if (rowParts.length === 2) {
                            rowParts[1].split(',').forEach(parentID => {
                                parentStack[id].push(parentID)
                            })
                            // Sort parents IDs
                            if (parentStack[id].length > 1) {
                                parentStack[id].sort()
                            }
                        }
                        // Create nte task and add it to the stack
                        this.tasksStack[id] = new Task(id)
                        // For each new task create a new event to
                        this.eventsStack[id] = new Event(id)
                    }
                })

                // Add parents to each task (set relations)
                // Add to each event related tasks - "id" and "out"
                Object.keys(this.tasksStack).forEach(id => {
                    let task = this.tasksStack[id]
                    let event = this.eventsStack[id]

                    // Add task to event's "out"
                    event.addTaskOut(task)

                    parentStack[id].forEach(parentID => {
                        let parentTask = this.tasksStack[parentID]
                        // Add parent to task
                        task.addParent(parentTask)
                        // Add it to event's "in"
                        event.addTaskIn(parentTask)
                    })
                })
            },
            joinEvents () {
                // Create tmp stacks for events and for "added to events tasks"
                let tmpEvents = {}
                let addedToEvents = {}
                Object.keys(this.eventsStack).forEach(id => {
                    let event = this.eventsStack[id]
                    // Create index for tmp events stack - just line with "in" tasks IDs
                    let tasksInIds = []
                    event.tasksIn.forEach(task => {
                        tasksInIds.push(task.id)
                        addedToEvents[task.id] = task
                    })
                    let inTasksIndex = tasksInIds.length > 0 ? tasksInIds.join(':') : 0

                    // Add in tmp events stack only events with unique "in" tasks
                    if (tmpEvents[inTasksIndex] === undefined) {
                        tmpEvents[inTasksIndex] = event
                    }

                    // Join all "out" tasks for all events with the same "in" tasks
                    event.tasksOut.forEach(task => {
                        tmpEvents[inTasksIndex].addTaskOut(task)
                    })
                })

                // Find last tasks - this is the tasks that wasn't added to tm stack
                let lastTasks = []
                Object.keys(this.tasksStack).forEach(id => {
                    if (addedToEvents[id] === undefined) {
                        lastTasks.push(id)
                    }
                })

                // If tasks without common result event are not empty - create a new "last" event and add them to event's "in"
                if (lastTasks.length > 0) {
                    // Create event with ID from it's future "in" tasks IDs
                    let lastEvent = new Event(lastTasks.join(':'))
                    lastTasks.forEach(id => {
                        lastEvent.addTaskIn(this.tasksStack[id])
                    })
                    // Add last event to tmp events stack
                    tmpEvents[lastEvent.id] = lastEvent
                }

                // Replace persistent events stack to temporary
                this.eventsStack = tmpEvents
            },
            setupEventsHierarchy () {
                Object.keys(this.eventsStack).forEach(id => {
                    let event = this.eventsStack[id]
                    // To find all event's children - just check who has one ot is's "out" tasks it his "in"
                    Object.keys(this.eventsStack).forEach(subID => {
                        // Not need tho check itself
                        if (subID !== id) {
                            let subEvent = this.eventsStack[subID]
                            event.tasksOut.forEach(task => {
                                if (subEvent.hasTaskIn(task)) {
                                    // You have one of my "out" tasks in your "in"? Grate: you area my child and I'm your parent!
                                    subEvent.addParent(event)
                                    event.addChild(subEvent)
                                }
                            })
                        }
                    })
                })
            },
            orderEvents () {
                // Create temporary array for events and push to it all events from stack
                let tmpEvents = []
                Object.keys(this.eventsStack).forEach(id => {
                    tmpEvents.push(this.eventsStack[id])
                })

                // Create index for new events IDs
                let index = 1

                // Clear unsorted events stack
                this.eventsStack = {}

                // Sort events by ranges, create new IDs for the and write them to stack
                tmpEvents.sort(function (event1, event2) {
                    let range1 = event1.getRange()
                    let range2 = event2.getRange()
                    if (range1 === range2) {
                        return event1.getMinTaskInID() > event2.getMinTaskInID() ? 1 : -1
                    }
                    return range1 > range2 ? 1 : -1
                }).forEach(event => {
                    // Set new event ID
                    event.id = index++
                    // Order event's parents and children
                    event.orderParents().orderChildren()
                    // Write event in stack with new ID
                    this.eventsStack[event.id] = event
                })
            }
        }
    }
</script>

<style scoped>

</style>
