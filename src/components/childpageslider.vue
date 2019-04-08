<template>
    <div>
       <div class="swiper-container" :id="swiperId">
            <div class="swiper-wrapper">
                <div v-for="(item,index) in list" :key="index" class="swiper-slide">
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
    需要在this.$store.state.Childpageslider内添加对应的groupname值
    本组件最好只用作列表展示用，内部不可以出现水平滚动条和
    组件最多嵌套两层,第一层nested的值为false，第二层nested的值为true。
    组件基于swiper 如果第一层被在另一个swiper内，则不存在第二层，且第一层nested为true。如果第一层外不存在swiper则第一层内可以放swiper，且nested的值为true，相当于第二层；第二层内不可以存在swiper和水平滑动的组件和浏览器默认水平滚动条。
*/
    import { mapState } from 'vuex';
    let Swiper = require('@/common/js/swiper/4.4.6/swiper.min.js').Swiper;
    const path = require("path");
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
                swiperCurr:{},
                swiperId:"swiper"+Math.random().toString().substr(2,8),
                list:[],
                isSliderUpdateRouter:false,
                isRouterUpdateSlider:false,
                routerUpdateCount : 2
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
                    path : element.path,
                    query : element.query,
                    show : false,
                    active : false
                })
            })
            //更新store->childpageslider
            this.$store.commit('Childpageslider/addSlider',{
                groupname:this.groupname,
                info:this.list
            })
        },
        mounted(){
            let initialSlide = 0;
            let findPage = false;
            this.$data.list.forEach((element,index)=>{
                if(!findPage){
                    //console.log(this.$route,element.name)
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
            //更新store->childpageslider
            this.$store.commit('Childpageslider/addSlider',{
                groupname:this.groupname,
                info:this.list
            })
            if(this.nested){
                this.list.forEach(element=>{
                    if(element.show){
                        if(element.path!==this.$route.path){//不是当前路径切换为当前路径
                            this.$router.push({path:element.path,query:element.query})
                        }
                    }
                })
            }
            if(!findPage){
                findPage = true
               this.$data.list[0].show = true
               this.$data.list[0].active = true
            }
            var that = this;
            that.swiperCurr = new Swiper('#'+this.swiperId,{
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
                                 that.$data.list[i].show=false //是否缓存页面
                            }
                        }
                    },
                    slideChangeTransitionEnd:function(){
                        for(let i=0; i < that.$data.list.length; i++){
                            if(i==this.activeIndex){
                                if(that.$data.list[i].show==false){
                                    that.$data.list[i].show=true
                                }
                                that.$store.state.Childpageslider.sliders[that.groupname].info[i].active=true
                                that.$data.list.active=true
                                //更新路由
                                let query = that.$data.list[i].query
                                query.swipter=1
                                let path = that.$data.list[i].path
                                that.isSliderUpdateRouter = true
                                if(that.nested){
                                    that.$data.routerUpdateCount = 2
                                }
                                // if(that.$route.query['swipter']&&that.$route.query.swipter==1){
                                //     return;
                                // }
                                if(!that.isRouterUpdateSlider){
                                   // console.log('==============',that.list)
                                    let isJump = false;
                                    if(!that.nested){//只在父级框架执行
                                    console.log(that.nested)
                                        for(var ele in that.$store.state.Childpageslider.sliders){
                                            //切换到第N个，第N个的path，第N个有子Path
                                            if(that.$store.state.Childpageslider.sliders[ele].groupname!=that.groupname){
                                                console.log(that.$store.state.Childpageslider.sliders[ele].groupname,'||',that.groupname)
                                                that.$store.state.Childpageslider.sliders[ele].info.forEach(sliderEach=>{
                                                    if(sliderEach.show&&sliderEach.active){
                                                        if(sliderEach.path.indexOf(that.list[i].path)!=-1){
                                                            console.log('gggg',{path:sliderEach.path,query:sliderEach.query})
                                                            that.$data.routerUpdateCount = 1
                                                            //that.isRouterUpdateSlider=true
                                                            console.log('date',{name:sliderEach.name,query:sliderEach.query})
                                                            isJump = true
                                                            that.$router.push({name:sliderEach.name,query:sliderEach.query})
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    if(!isJump){
                                        that.$router.push({path:path,query:query})
                                    }
                                }else{
                                    that.isRouterUpdateSlider=false
                                }
                            }else{
                                //that.$data.list[i].show=false //是否缓存页面
                                //that.$store.state.Childpageslider.sliders[that.groupname].info[i].show=false
                                that.list[i].active=false
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
            '$route':{
                handler(to,from){
                    let findPage = false
                    let that = this
  //                  console.log('ssssssssssssssssssssssssssssssssss')
                    if(typeof(that.$route.query.swipter)=='undefined'){
                        if(that.nested){
                            //route that.$route that.$router that.$store.state.Childpageslider.sliders 匹配 route,从外到内
                            for(var sliderGroup in that.$store.state.Childpageslider.sliders){
                                that.$store.state.Childpageslider.sliders[sliderGroup].info.forEach((element,index)=>{
                                   let hasTopath = false
                                    that.list.forEach(elelist=>{
                                        if(elelist.path==to.path){
                                            hasTopath = true
                                        }
                                    })
                                    if(!hasTopath){
                                        return
                                    }
                                    if(element.path == to.path){
                                        let hasSameQuery = true
                                        for(let queryStr in element.query){
                                            if(typeof(to.query[queryStr])!='undefined'){
                                                if(to.query[queryStr] != element.query[queryStr]){
                                                    hasSameQuery = false
                                                }
                                            }
                                        }
                                        if(hasSameQuery){
                                            element.query.swipter=1
                                            //alert(element.query.typeid)
                                            that.$router.push({path:element.path,query:element.query})
                                            if(typeof(that.swiperCurr.slideTo)!=='undefined'){
                                                if(that.swiperCurr.activeIndex!==index){
                                                    that.swiperCurr.slideTo(index,0)
                                                }
                                            }
                                        }
                                        //that.swiperCurr.slideTo(index,0)
                                    }
                                })
                            }
                        }else{
                            for(var sliderGroup in that.$store.state.Childpageslider.sliders){
                                that.$store.state.Childpageslider.sliders[sliderGroup].info.forEach((element,index)=>{
                                    let hasTopath = false
                                    that.list.forEach(elelist=>{
                                        if(elelist.path==to.path){
                                            hasTopath = true
                                        }
                                    })
                                    if(!hasTopath){
                                        return
                                    }
                                    if(that.swiperCurr)
                                    if(element.path == to.path){
                                        let hasSameQuery = true
                                        for(let queryStr in element.query){
                                            if(typeof(to.query[queryStr])!='undefined'){
                                                if(to.query[queryStr] != element.query[queryStr]){
                                                    hasSameQuery = false
                                                }
                                            }
                                        }
                                        if(hasSameQuery){
                                            element.query.swipter=1
                                            //alert(element.query.typeid)
                                            that.$router.push({path:element.path,query:element.query})
                                            if(typeof(that.swiperCurr.slideTo)!=='undefined'){
                                                that.swiperCurr.slideTo(index,0)
                                            }
                                        }
                                        //that.swiperCurr.slideTo(index,0)
                                    }
                                })
                            }
                        }
                    }else{
                        if(that.nested){
                            that.$data.routerUpdateCount--
                            if(that.$data.routerUpdateCount>0){
                                return
                            }
                        }
                        //console.log('swiper',that.$route.query.swipter)
                    //很大一个坑，嵌套childpageslider会绑定两次watch
                        that.$store.state.Childpageslider.sliders[this.groupname].info.forEach(slider=>{
                            if(slider.name===to.name){
                                //console.log(222222222222222,that.isSliderUpdateRouter)
                                //that.isRouterUpdateSlider=true
                                //console.log('=========',slider.name,to.name,that.isRouterUpdateSlider,that.isSliderUpdateRouter)

                                if(that.isSliderUpdateRouter){
                                    that.isSliderUpdateRouter = false
                                }else{
                                    //console.log(3333333333333333)
                                    this.$data.list.forEach((element,index)=>{
                                        if(!findPage){
                                            // console.log(that.findRouterPathByName(that.$router.options.routes,element.name))
                                            if(to.path == that.findRouterPathByName(that.$router.options.routes,element.name)){
                                                element.show = true
                                                // this.$store.state.Childpageslider.sliders[this.groupname].info[i].show=true
                                                // this.$store.state.Childpageslider.sliders[this.groupname].info[i].active=true
                                                findPage = true
                                                that.swiperCurr.slideTo(index,0)
                                            }
                                        }
                                        //console.log(element.name.indexOf(this.$route.name.substr(0,element.name.length)));
                                    });
                                }
                            }
                        })
                    }
                },
                immediate:true
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
