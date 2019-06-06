<template>
    <div>
        <div class="wp_yingshi_list">
            <div class="screenbox">
                <router-link :to="{path:'/vue/dianying/dianshiju/list',query:{typeid:10}}" :class="{active:this.$route.query.typeid==10}">国产剧</router-link>
                <router-link :to="{path:'/vue/dianying/dianshiju/list',query:{typeid:14}}" :class="{active:this.$route.query.typeid==14}">港台剧</router-link>
                <router-link :to="{path:'/vue/dianying/dianshiju/list',query:{typeid:15}}" :class="{active:this.$route.query.typeid==15}">欧美剧</router-link>
                <router-link :to="{path:'/vue/dianying/dianshiju/list',query:{typeid:16}}" :class="{active:this.$route.query.typeid==16}">泰剧</router-link>
                <router-link :to="{path:'/vue/dianying/dianshiju/list',query:{typeid:17}}" :class="{active:this.$route.query.typeid==17}">韩剧</router-link>
                <router-link :to="{path:'/vue/dianying/dianshiju/list',query:{typeid:18}}" :class="{active:this.$route.query.typeid==18}">日剧</router-link>        </div>
            <childpageslider :class="'movieChildslider'" :groupname="'dianshiju'" :dataSlider="dataSlider" nested></childpageslider>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        meta:{
            'title':'电视剧'
        },
        data() {
                return {
                    dataSlider:[
                        {
                            path:this.rootPath+'/dianying/dianshiju/list',
                            query:{typeid:10}
                        },{
                            path:this.rootPath+'/dianying/dianshiju/list',
                            query:{typeid:14}
                        },{
                            path:this.rootPath+'/dianying/dianshiju/list',
                            query:{typeid:15}
                        },{
                            path:this.rootPath+'/dianying/dianshiju/list',
                            query:{typeid:16}
                        },{
                            path:this.rootPath+'/dianying/dianshiju/list',
                            query:{typeid:17}
                        },{
                            path:this.rootPath+'/dianying/dianshiju/list',
                            query:{typeid:18}
                        }
                    ]
                }
        },
        computed:{
        },
        created(){
        },
        mounted(){
            this.$router.push(this.dataSlider[0])
        },
        methods: {
        },
        watch:{
            '$route':function(to,from){
                if(to.fullPath!=from.fullPath){
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .movieChildslider{
        height: calc(100vh - 1rem - 1.1rem);
    }
    /deep/ .active{
        color:#09bb07;
    }
    .wp_yingshi_list{
        height: calc(100vh - 1rem - 1.2rem);
    }
    .screenbox{
        padding:8px .2rem 0;
        a{
            padding:0 .5em;
            font-size: 14px;
            line-height: 2;
        }
    }
    .list-price{
        white-space: nowrap;
        width: 80%;
        text-overflow:ellipsis;
        overflow: hidden;
    }
    .note{
        white-space: nowrap;
    }
</style>

