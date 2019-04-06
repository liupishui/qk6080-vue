<template>
    <div>
        <div class="playbox">
            <div class="ckplayer">
                <CkplayerCkplayer :src="movieAddress"></CkplayerCkplayer>
            </div>
        </div>
        <div :style="{color:'#f00',padding:'10px'}">
        <h2 :style="{'font-size':'20px','padding-top':'4px','line-height':'1.8'}">
            KakaM3u8播放
        </h2>
        <div>
            <span :class="{playCurr:movieCurrId == item.id}" :style="{border:'1px solid #ccc',width:'60px','text-align':'center','display':'inline-block','line-height':'34px','margin-right':'-1px','margin-bottom':'-1px'}" v-for="(item,key) in kakam3u8" :key="key" :data-id="item.id" v-on:click="playvideo">
                {{key+1}}
            </span>
        </div>
        <h2 :style="{'font-size':'20px','padding-top':'4px','line-height':'1.8'}">
            kuyun播放
        </h2>
        <div>
            <span :class="{playCurr:movieCurrId == item.id}" :style="{border:'1px solid #ccc',width:'60px','text-align':'center','display':'inline-block','line-height':'34px','margin-right':'-1px','margin-bottom':'-1px'}" v-for="(item,key) in kuyun" :key="key" :data-id="item.id" v-on:click="playvideo">
                {{key+1}}
            </span>
        </div>
        </div>
    </div>
</template>
<script>
    let _ = require('lodash');
    export default {
        props:{
            playid:{
                type:String,
                default:''
            }
        },
        data(){
            return {
                kuyun:[],
                kakam3u8:[],
                movieAddress:'',
                movieCurrId:''
            }
        },
        mounted(){
            //this.playid = this.$route.params.num;
            this.loadList();
        },
        methods:{
            playvideo(event){
                let detailid = event.target.getAttribute('data-id');
                this.movieCurrId = detailid;
                this.movieAddress = _.find([...this.kuyun,...this.kakam3u8],{id:detailid}).address;
            },
            loadList(){
                this.$axios.get('/detail.php?id='+this.playid).then((res)=>{
                    this.kuyun = res.data.kuyun;
                    this.kakam3u8 = res.data.kakam3u8;
                });
            }
        },
        watch:{
            'kakam3u8':function(){
                this.movieAddress = this.kakam3u8[0].address;
                this.movieCurrId = this.kakam3u8[0].id;
            }
        }
    }
</script>
<style scoped>
    .playbox{
        padding-bottom: 56.25%;
        position: relative;
        background:#000;
    }
    .ckplayer{
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .playCurr{
        background: #fff8dc;
    }
</style>
