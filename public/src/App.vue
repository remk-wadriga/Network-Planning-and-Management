<template src="@/templates/app.html" />

<script>
    import Vue from 'vue'
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import { mapMutations } from 'vuex'
    import {
        ROUTE_HOMEPAGE
    } from '@/router/routes-list'

export default {
    name: 'App',
    data () {
        return {
            routeHomepage: ROUTE_HOMEPAGE
        }
    }
}
</script>

<style src="@/assets/font-awesome.css" />
<style src="@/assets/app.css" />
