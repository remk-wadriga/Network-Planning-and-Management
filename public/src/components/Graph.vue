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
                paddingTopDefault: -90,
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
            createNode (event) {
                this.nodesCount++
                return {
                    id: event.id,
                    x: 0,
                    y: 0,
                    type: 'Event',
                    label: event.id.toString(),
                    xLevel: 0,
                    yLevel: event.getRange()
                }
            }
        },
        mounted () {
            // Set params (or get default)
            let paddingLeft = this.paddingLeft !== undefined ? this.paddingLeft : this.paddingLeftDefault
            let paddingTop = this.paddingTop !== undefined ? this.paddingTop : this.paddingTopDefault
            let deltaX = this.deltaX !== undefined ? this.deltaX : this.deltaXDefault
            let deltaY = this.deltaY !== undefined ? this.deltaY : this.deltaYDefault

            // Create tmp variables
            let nodes = {}
            let levels = {}
            let levelsCount = 0
            let maxXLevelsCount = 0

            // Create nodes and vertical levels
            this.data.forEach(event => {
                // Create node from event
                let node = this.createNode(event)
                // Calculate node's "y" position (based on event's range)
                node.y = node.yLevel * deltaY
                // Add node to tmp and persistent cache
                nodes[node.label] = node
                this.params.nodes.push(node)

                // Add node to it's vertical "level"
                if (levels[node.yLevel] === undefined) {
                    levels[node.yLevel] = []
                    levelsCount++
                }
                levels[node.yLevel].push(node)

                // Add event children to "links" array
                event.children.forEach(child => {
                    this.params.links.push({from: event.id, to: child.id})
                })
            })

            // Calculate max count of nodes per vertical level and set horizontal levels for each node
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

            // Calculate "x" position for each node (based on it's horizontal position)
            Object.keys(nodes).forEach(id => {
                let node = nodes[id]
                let currentXLevelsCount = levels[node.yLevel].length
                node.x = (node.xLevel + (maxXLevelsCount - currentXLevelsCount) / 2) * deltaX
            })

            // Set page params
            this.params.centerX = paddingLeft
            this.params.centerY = paddingTop
            this.contentHeight = this.height !== undefined ? this.height : levelsCount * deltaY - paddingTop / 2
        }
    }
</script>

<style scoped>

</style>
