<template>
    <div>
        <div class="playbox">
            <CkplayerCkplayer :src="movieAddress"></CkplayerCkplayer>
        </div>
        <div>
            <span v-for="(item,key) in kuyun" :key="key" :data-id="item.id" v-on:click="playvideo">
                {{item.id}}
            </span>
        </div>
        <div>
            <span v-for="(item,key) in kakam3u8" :key="key" :data-id="item.id" v-on:click="playvideo">
                {{item.id}}
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                playid:'152',
                kuyun:[],
                kakam3u8:[],
                movieAddress:''
            }
        },
        mounted(){
            console.log(2)
            if(this.$route.params.num){
                this.playid = this.$route.params.num;
            }
            this.loadList();
        },
        methods:{
            playvideo(event){
                let detailid = event.target.getAttribute('data-id');
                this.movieAddress = _.find([...this.kuyun,...this.kakam3u8],{id:detailid}).address;
            },
            loadList(){
                this.$axios.get('/detail.php',{
                    params:{"id":this.playid}
                }).then((res)=>{
                    console.log(res.data.kuyun);
                    this.kuyun = res.data.kuyun;
                    this.kakam3u8 = res.data.kakam3u8;
                });
            }
        },
        watch:{
            'kakam3u8':function(){
                console.log(111,this.kuyun)
                if(this.kakam3u8[0].address){
                    this.movieAddress = this.kakam3u8[0].address;
                }
            }
        }
    }
</script>
<style scoped>
    .playbox{
        height:calc(100vh * 0.5625);
        background:#000;
    }
</style>
