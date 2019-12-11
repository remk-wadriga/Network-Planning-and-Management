<template src="@/templates/project/index.html" />

<script>
    import Graph from "@/components/Graph";

export default {
    name: 'Index',
    components: { Graph },
    data () {
        return {
            projectData: [
                [1, 2],
                [1, 3],
                [2, 4],
                [2, 5],
                [3, 5],
                [3, 6],
                [3, 7],
                [4, 8],
                [5, 8],
                [6, 9],
                [6, 10],
                [7, 10],
                [8, 11],
                [9, 11],
                [10, 11]
            ]
        }
    }
}
</script>

<style scoped>
</style>
