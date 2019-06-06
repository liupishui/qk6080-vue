<template>
    <div>
        <div class="wp_yingshi_list">
            <div class="screenbox">
                <router-link :to="{path:'/vue/dianying/dianying/list',query:{typeid:1}}" :class="{active:this.$route.query.typeid==1}">动作</router-link>
                <router-link :to="{path:'/vue/dianying/dianying/list',query:{typeid:2}}" :class="{active:this.$route.query.typeid==2}">喜剧片</router-link>
                <router-link :to="{path:'/vue/dianying/dianying/list',query:{typeid:3}}" :class="{active:this.$route.query.typeid==3}">爱情片</router-link>
                <router-link :to="{path:'/vue/dianying/dianying/list',query:{typeid:4}}" :class="{active:this.$route.query.typeid==4}">科幻片</router-link>
                <router-link :to="{path:'/vue/dianying/dianying/list',query:{typeid:5}}" :class="{active:this.$route.query.typeid==5}">恐怖片</router-link>
                <router-link :to="{path:'/vue/dianying/dianying/list',query:{typeid:6}}" :class="{active:this.$route.query.typeid==6}">剧情片</router-link>
                <router-link :to="{path:'/vue/dianying/dianying/list',query:{typeid:7}}" :class="{active:this.$route.query.typeid==7}">战争片</router-link>
                <router-link :to="{path:'/vue/dianying/dianying/list',query:{typeid:13}}" :class="{active:this.$route.query.typeid==13}">伦理</router-link>
            </div>
            <childpageslider :class="'movieChildslider'" :groupname="'dianyinglist'" :dataSlider="dataSlider" nested></childpageslider>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        meta:{
            'title':'电影列表'
        },
        data() {
                return {
                    dataSlider:[
                        {
                            path:this.rootPath+'/dianying/dianying/list',
                            query:{typeid:1}
                        },{
                            path:this.rootPath+'/dianying/dianying/list',
                            query:{typeid:2}
                        },{
                            path:this.rootPath+'/dianying/dianying/list',
                            query:{typeid:3}
                        },{
                            path:this.rootPath+'/dianying/dianying/list',
                            query:{typeid:4}
                        },{
                            path:this.rootPath+'/dianying/dianying/list',
                            query:{typeid:5}
                        },{
                            path:this.rootPath+'/dianying/dianying/list',
                            query:{typeid:6}
                        },{
                            path:this.rootPath+'/dianying/dianying/list',
                            query:{typeid:7}
                        },{
                            path:this.rootPath+'/dianying/dianying/list',
                            query:{typeid:13}
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
        height: calc(100vh - 1rem - 1rem);
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

