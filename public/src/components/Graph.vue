<template src="@/templates/graph.html" />

<script>
    import SimpleFlowchart from 'vue-simple-flowchart'
    import 'vue-simple-flowchart/dist/vue-flowchart.css'

    export default {
        name: "Graph",
        components: { SimpleFlowchart },
        props: {
            data: Array,
            height: Number,
            paddingLeft: Number,
            paddingTop: Number,
            deltaX: Number,
            deltaY: Number
        },
        data () {
            return {
                nodesCount: 0,
                contentHeight: 800,
                paddingLeftDefault: -100,
                paddingTopDefault: 30,
                deltaXDefault: 140,
                deltaYDefault: 150,
                params: {
                    centerX: 0,
                    centerY: 0,
                    scale: 1,
                    nodes: [],
                    links: []
                }
            }
        },
        methods: {
            createNode (id, label) {
                this.nodesCount++
                let node = {
                    id: id,
                    x: 0,
                    y: 0,
                    type: 'Event',
                    label: label !== undefined && label !== null ? label : id,
                    parent: null,
                    xLevel: 0
                }
                if (typeof node.label === 'number') {
                    node.label = node.label.toString()
                }
                return node
            },
            countParents (node, count = 0) {
                if (node.parent === null) {
                    return count
                }
                return this.countParents(node.parent, count + 1)
            }
        },
        mounted () {
            let paddingLeft = this.paddingLeft !== undefined ? this.paddingLeft : this.paddingLeftDefault
            let paddingTop = this.paddingTop !== undefined ? this.paddingTop : this.paddingTopDefault
            let deltaX = this.deltaX !== undefined ? this.deltaX : this.deltaXDefault
            let deltaY = this.deltaY !== undefined ? this.deltaY : this.deltaYDefault

            let nodes = {}
            let levels = {}
            let levelsCount = 0
            let maxXLevelsCount = 0

            this.data.forEach(rel => {
                let fromID = rel[0]
                let toID = rel[1]
                let fromNode = nodes[fromID]
                let toNode = nodes[toID]
                if (fromNode === undefined) {
                    fromNode = this.createNode(fromID, rel[2])
                    nodes[fromID] = fromNode
                    this.params.nodes.push(fromNode)
                }
                if (toNode === undefined) {
                    toNode = this.createNode(toID, rel[3])
                    nodes[toID] = toNode
                    this.params.nodes.push(toNode)
                }
                this.params.links.push({from: fromID, to: toID})
                toNode.parent = fromNode
            })

            Object.keys(nodes).forEach(id => {
                let node = nodes[id]
                let level = this.countParents(node)
                node.y = level * deltaY
                if (levels[level] === undefined) {
                    levels[level] = []
                    levelsCount++
                }
                levels[level].push(node)
            })

            Object.keys(levels).forEach(level => {
                let xLevel = 0
                levels[level].forEach(node => {
                    xLevel++
                    node.xLevel += xLevel
                })
                if (xLevel > maxXLevelsCount) {
                    maxXLevelsCount = xLevel
                }
            })

            Object.keys(levels).forEach(level => {
                let currentXLevelsCount = levels[level].length
                levels[level].forEach(node => {
                    node.x = (node.xLevel + (maxXLevelsCount - currentXLevelsCount) / 2) * deltaX
                })
            })

            this.params.centerX = paddingLeft
            this.params.centerY = paddingTop
            this.contentHeight = this.height !== undefined ? this.height : levelsCount * deltaY - paddingTop / 2
        }
    }
</script>

<style scoped>

</style>
