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
        props:{
            query:{
                type:Object,
                default:{typeid:1000}
            }
        },
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
            console.log(this.query)
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
                console.log(that.$store)
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
<style lang="less" scoped>
    .yd-list-theme1 {
        /deep/ .yd-list-item{
            width: 25%;
            .yd-list-img{
                position: relative;
                background: url(data:image/png;base64,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) no-repeat center center;
                background-size: 100% auto;
            }
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

