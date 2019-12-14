import Stack from "@/entities/Stack"

export default class Event extends Stack {
    constructor (id) {
        super()
        this.id = parseInt(id)
        this.range = 0
        this.tasksIn = []
        this.tasksOut = []
        this.parents = []
        this.children = []
        this.minTaskInID = null
    }

    addTaskIn (task) {
        if (this.getFromStack('tasksIn', task) === undefined) {
            this.addToStack('tasksIn', task)
            this.tasksIn.push(task)
        }
        return this
    }

    addTaskOut (task) {
        if (this.getFromStack('tasksOut', task) === undefined) {
            this.addToStack('tasksOut', task)
            this.tasksOut.push(task)
        }
        return this
    }

    addParent (event) {
        if (this.getFromStack('parents', event) === undefined) {
            this.addToStack('parents', event)
            this.parents.push(event)
        }
        return this
    }

    addChild (event) {
        if (this.getFromStack('children', event) === undefined) {
            this.addToStack('children', event)
            this.children.push(event)
        }
    }

    hasTaskIn(task) {
        return this.getFromStack('tasksIn', task) !== undefined
    }

    getRange () {
        if (this.range > 0) {
            return this.range
        }
        let maxRange = 1
        this.parents.forEach(parent => {
            let parentRange = parent.getRange() + 1
            if (parentRange > maxRange) {
                maxRange = parentRange
            }
        })
        return this.range = maxRange
    }

    getMinTaskInID () {
        if (this.minTaskInID !== null) {
            return this.minTaskInID
        }
        this.minTaskInID = 0
        this.tasksIn.forEach(task => {
            if (this.minTaskInID === 0 || task.id < this.minTaskInID) {
                this.minTaskInID = task.id
            }
        })
        return this.minTaskInID
    }

    orderParents () {
        this.parents = this.parents.sort(function (event1, event2) {
            return event1.getMinTaskInID() > event2.getMinTaskInID() ? 1 : -1
        })
        return this
    }

    orderChildren () {
        this.children = this.children.sort(function (event1, event2) {
            return event1.getMinTaskInID() > event2.getMinTaskInID() ? 1 : -1
        })
        return this
    }
}
