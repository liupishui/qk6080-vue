<template>
    <div>
       <div class="swiper-container" :id="swiperId">
            <div class="swiper-wrapper">
                <div v-for="(item,index) in list" :key="index" class="swiper-slide">
                    {{item.query.typeid+item.name}}
                        <keep-alive>
                            <router-view :name="item.name" :query="item.query" v-if="item.show"></router-view>
                        </keep-alive>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//长页面滑动问题 https://blog.csdn.net/Elephant_H/article/details/80856053，http://www.cnblogs.com/lzk318/p/8991050.html
/*使用说明
        <childpageslider :groupname="'dianying'" :dataSlider="dataSlider" nested></childpageslider>
                dataSlider:[
                        {
                            path:this.rootPath+'/dianying/dianying',
                            query:{typeid:1}
                        },
                        {
                            path:this.rootPath+'/dianying/dianshiju',
                            query:{typeid:10}
                        },{
                            path:this.rootPath+'/dianying/zongyi',
                            query:{typeid:11}
                        }
                    ]
    本组件最好只用作列表展示用，内部不可以出现水平滚动条和
    组件最多嵌套两层,第一层nested的值为false，第二层nested的值为true。
    组件基于swiper 如果第一层被在另一个swiper内，则不存在第二层，且第一层nested为true。如果第一层外不存在swiper则第一层内可以放swiper，且nested的值为true，相当于第二层；第二层内不可以存在swiper和水平滑动的组件和浏览器默认水平滚动条。
*/
    import { mapState } from 'vuex';
    let Swiper = require('@/common/js/swiper/4.4.6/swiper.min.js').Swiper;
    const path = require("path");
    let swiperCurr={};
    let isSliderUpdateRouter = false;
    export default {
        props:{
            groupname:{
                type:String,
                default:'default'
            },
            nested:{
                type:Boolean,
                default:false //第一层嵌套默认为false，第二层(子层)嵌套必须设为true。最多嵌套两层，内层内不能有横向滑动
            },
            dataSlider:{
                type:Array,
                default:function(){
                    return [
                        {
                            path:this.rootPath+'/dianying/dianying',
                            query:{typeid:'2'}
                        },{
                            path:this.rootPath+'/dianying/dianshiju',
                            query:{typeid:'3'}
                        }
                    ]
                }
            }
        },
        data(){
            return {
                swiperId:"swiper"+Math.random().toString().substr(2,8),
                list:[],
                routerUpdateCount:0
            }
        },
        computed:{
            ...mapState({
                sliders:(state)=>{
                    return state.Childpageslider.sliders
                }
            })
        },
        created(){
            // console.log('============',this.dataSlider[0].path)
            // console.log(findRouterViewName(this.$router.options.routes,this.dataSlider[0].path))
            this.dataSlider.forEach(element => {//初始化数组
                this.$data.list.push({
                    name : this.findRouterViewNameByPath(this.$router.options.routes,element.path),
                    query : element.query,
                    show : false,
                    active : false
                })
            })
        },
        mounted(){
            let initialSlide = 0;
            let findPage = false;
            this.$data.list.forEach((element,index)=>{
                if(!findPage){
                    console.log(this.$route,element.name)
                    this.$route.matched.forEach(el=>{
                        if(el.name==element.name){
                            initialSlide = index
                            findPage = true
                            element.show = true
                            element.active = true
                        }
                    })
                }
                //console.log(element.name.indexOf(this.$route.name.substr(0,element.name.length)));
            });
            if(!findPage){
                findPage = true
                this.$data.list[0].show = true
                this.$data.list[0].active = true
            }
            //更新store->childpageslider
            this.$store.commit('Childpageslider/addSlider',{
                groupname:this.groupname,
                info:this.$data.list
            })
            var that = this;
            swiperCurr = new Swiper('#'+this.swiperId,{
                initialSlide:initialSlide,
                nested:that.nested,
                resistanceRatio:!that.nested,
                on:{
                    touchStart: function(){
                        for(let i=0;i<that.$data.list.length;i++){
                            if(i==this.activeIndex-1||i==this.activeIndex||i==this.activeIndex+1){
                                if(that.$data.list[i].show==false){
                                    that.$data.list[i].show=true;
                                }
                            }else{
                                 //that.$data.list[i].show=false //是否缓存页面
                            }
                        }
                    },
                    slideChangeTransitionEnd:function(){
                        for(let i=0; i < that.$data.list.length; i++){
                            if(i==this.activeIndex){
                                if(that.$data.list[i].show==false){
                                    that.$data.list[i].show=true
                                }
                                //that.$store.state.Childpageslider.sliders[that.groupname].info[i].show=true
                                that.$store.state.Childpageslider.sliders[that.groupname].info[i].active=true
                                //更新路由
                                let query = that.$store.state.Childpageslider.sliders[that.groupname].info[i].query
                                let path = that.findRouterPathByName(that.$router.options.routes,that.$store.state.Childpageslider.sliders[that.groupname].info[i].name)
                                isSliderUpdateRouter = true
                                console.log(111)
                                that.$router.push({path:path,query:query})
                            }else{
                                //that.$data.list[i].show=false //是否缓存页面
                                //that.$store.state.Childpageslider.sliders[that.groupname].info[i].show=false
                                that.$store.state.Childpageslider.sliders[that.groupname].info[i].active=false
                            }
                        }
                    }
                }
            })
        },
        methods:{
            findRouterViewNameByPath:function(routers,path){
                let nameFind = '';
                let findRouterViewNameInner = function(routers,path){
                    let isFind = false;
                    routers.forEach(element=>{
                       // console.log('--------------------',element.path,path)
                        if(element.path === path){
                            isFind = true
                            nameFind = element.name
                        }
                    })
                    if(!isFind){
                        routers.forEach(element=>{
                            if(element.children&&element.children.length){
                                findRouterViewNameInner(element.children,path)
                            }
                        })
                    }
                }
                findRouterViewNameInner(routers,path)
                return nameFind;
            },
            findRouterPathByName:function(routers,name){
                let pathFind = ''
                let findRouterPathByNameInner = function(routers,name){
                    let isFind = false
                    routers.forEach(element=>{
                        if(element.name === name){
                            isFind = true
                            pathFind = element.path
                        }
                    })
                    if(!isFind){
                        routers.forEach(element=>{
                            if(element.children&&element.children.length){
                                findRouterPathByNameInner(element.children,name)
                            }
                        })
                    }
                }
                findRouterPathByNameInner(routers,name)
                return pathFind
            }
        },
        watch:{
            '$route'(to,from){
                let findPage = false
                let that = this
                    console.log('sssssssssssss',that.$store.state.Childpageslider.sliders[this.groupname].info)
                if(isSliderUpdateRouter){
                    isSliderUpdateRouter = false
                }else{

                    this.$data.list.forEach((element,index)=>{
                        if(!findPage){
                            console.log('eggg',element)
                            console.log(that.findRouterPathByName(that.$router.options.routes,element.name))
                            if(to.path == that.findRouterPathByName(that.$router.options.routes,element.name)){
                                console.log('==========',index)
                                element.show = true
                                // this.$store.state.Childpageslider.sliders[this.groupname].info[i].show=true
                                // this.$store.state.Childpageslider.sliders[this.groupname].info[i].active=true
                                findPage = true
                                swiperCurr.slideTo(index,0)
                            }
                        }
                        //console.log(element.name.indexOf(this.$route.name.substr(0,element.name.length)));
                    });
                }
            }
        }
    }

</script>
<style scoped>
    @import '../common/js/swiper/4.4.6/swiper.min.css';
    .swiper-container {
      width: 100%;
      height: 100%;
      text-align: left;
    }
</style>
