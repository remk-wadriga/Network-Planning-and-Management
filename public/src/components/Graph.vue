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

        },
        mounted () {
            console.log(this.data)
        }
    }
</script>

<style scoped>

</style>
