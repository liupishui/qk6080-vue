<template>
    <div>
        <childpageslider :groupname="'dianying'" :dataSlider="dataSlider"></childpageslider>
        <!--播放器-->
        <transition name="slideup">
            <div class="playboxWp" v-if="showplay">
                <Play :playid="currentMovieId"></Play>
            </div>
        </transition>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        data() {
                return {
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
                }
        },
        created(){
            if(this.$route.params.typeid){
                this.typeid = this.$route.params.typeid
            }else{
                this.typeid = this.typeidCurr
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
        mounted(){
            let that = this;
            $("body").click(function(e){
                //更新store-》Movie
                if($(e.target).hasClass('playboxWp')||($(e.target)[0].tagName.toLowerCase()!='span'&&$('.playboxWp .playbox').next().has($(e.target)).length)){
                   that.$store.state.Movie.showplay = false;
                }
            });

        },
        methods: {
        },
        watch:{
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
    .playboxWp{
        position:fixed;
        z-index:9999;
        width:100%;
        max-width:750px;
        min-width:350px;
        transform:translate(-50%,-100%);
        background:rgba(0,0,0,.9);
        color:#fff;
        top:100%;
        left:50%;
        height:100%;
        overflow-y:auto;
        z-index:10;
    }
    .slideup-enter-active, .slideup-leave-active {
        transition: transform .5s;
    }
    .slideup-enter, .slideup-leave-to /* .fade-leave-active below version 2.1.8 */ {
        transform: translate(-50%,100%);
    }
</style>

