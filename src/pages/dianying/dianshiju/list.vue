<template>
    <div>
        <List :query="query"/>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        meta:{
            'title':'电视剧'
        },
        props:['query'],
        data() {
                return {
                }
        }
    }
</script>
<style scoped>

</style>

