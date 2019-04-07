<template>
    <div>
        <div :style="{'height':'calc(100vh - 2.12rem)','overflow':'auto'}">
            <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">

                <yd-list theme="1" slot="list">
                    <yd-list-item v-for="(item, key) in list" :key="key" v-on:click='showplayLayer' :data-href="item.id">
                        <img slot="img" :src="item.poster" :data-org="item.posters" :onerror='imgError'>
                        <span slot="title">{{item.name}}</span>
                        <yd-list-other slot="other">
                            <div class="list-price">
                                <span>{{item.yanyuan==''?'&nbsp;':item.yanyuan}}</span>
                            </div>
                            <div class="note">{{item.note}}</div>
                        </yd-list-other>
                    </yd-list-item>
                </yd-list>

                <!-- 数据全部加载完毕显示 -->
                <span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>

                <!-- 加载中提示，不指定，将显示默认加载中图标 -->
                <img slot="loadingTip" src="/static/loading.svg"/>

            </yd-infinitescroll>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        meta:{
            'title':'电影'
        },
        props:['query'],
        data() {
                return {
                    page: 1,
                    pageSize: 18,
                    imgError:"this.onerror='';this.src=this.getAttribute('data-org')",
                    typeid:this.param,
                    list: [
                    ]
                }
        },
        computed:{
            ...mapState({
                currentMovieId:(store) => {
                    return store.Movie.currentMovieId;
                },
                showplay:(store)=>{
                    return store.Movie.showplay;
                }
            })
        },
        created(){
            if(this.query.typeid){
                this.typeid = this.query.typeid
            }else{
                this.typeid = this.$route.query.typeid
            }
        },
        mounted(){
            let that = this;
            this.loadList();
            //this.typeid=this.$router.param.typeid;
            $("#scrollView").delegate('.yd-list-item','click',function(e){
                e.preventDefault();
                that.$store.state.Movie.showplay=true;
                that.$store.state.Movie.currentMovieId=$(this).attr('data-href');
            });
            $("body").click(function(e){
                if($(e.target).hasClass('playboxWp')||($(e.target)[0].tagName.toLowerCase()!='span'&&$('.playboxWp .playbox').next().has($(e.target)).length)){
                   that.$store.state.Movie.showplay = false;
                }
            });
        },
        methods: {
            showplayLayer:function(event){
                console.log('----',event)
            },
            loadList() {
                let _self = this
                this.$api.get('/list.php',{"page":this.page,'id'  :this.typeid})
                .then((res)=>{
                    const _list = res.data;
                    let _listCurr = [];
                    _list.forEach((ele,key)=>{
                        let imgsrc = ele.poster;
                        ele.poster = _self.$api.config.img_url + ele.poster.substr(ele.poster.lastIndexOf('/'));
                        ele.posters = imgsrc;
                    })
                    this.list = [...this.list, ..._list];

                    //if (_list.length < this.pageSize || this.page == 3) {
                    if (_list.length < this.pageSize) {
                        /* 所有数据加载完毕 */
                        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                        return;
                    }

                    /* 单次请求数据完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');

                    this.page++;
                },(err)=>{
                    console.log(err)
                })
            }
        },
        watch:{
            '$route':function(to,from){
                if(to.fullPath!=from.fullPath){
                }
            }
        }
    }
</script>
<style scoped>
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

