import Stack from "@/entities/Stack"

export default class Task extends Stack {
    constructor (id, parents) {
        super()

        this.id = parseInt(id)
        this.parents = []

        if (typeof parents === 'object') {
            parents.forEach(parent => {
                this.addParent(parent)
            })
        }
    }

    addParent (parent) {
        if (this.getFromStack('parents', parent) === undefined) {
            this.addToStack('parents', parent)
            this.parents.push(parent)
        }
    }
}
