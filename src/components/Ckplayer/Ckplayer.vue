<template>
    <div class="ckplayer">
        <div :id="videoid">
        </div>
    </div>
</template>
<script>
export default {
    name: 'Ckplayer',
    props: {
        src:{
            type:String,
            default:''
        }
    },
    data () {
        return {
            messages: 'HelloWorld',
            videoid: new Date()-1+Math.random().toString().substr(2),
        }
    },
    mounted: function(){
        this.playMovie();
    },
    methods:{
        playMovie(){
            if(this.src!=''&&this.src.indexOf('.m3u8')==-1){
                document.getElementById(this.videoid).innerHTML='<iframe align="center,center" vspace="0" hspace="0" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" style="border:0;vertical-align:bottom;margin:0;left:0;position:absolute;width:100%;height:100%;"  allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" allowtransparency="true" src="' + this.src + '"></iframe>'
            }else{
                var flashvars = {
                    f: '/static/m3u8/m3u8.swf',
                    s: 4,
                    c: 0,
                    b: 0,
                    p: 1
                };
                if(this.src){
                    flashvars.a=this.src
                }else{
                    flashvars.a='https://kakazy-yun.com/20190218/18344_48525b5a/index.m3u8'
                }
                var params = {
                    bgcolor: '#FFF',
                    allowFullScreen: true,
                    allowScriptAccess: 'always',
                    wmode: 'transparent'
                };
                    var isMobile = false;
                    (function(){try{var e=navigator.userAgent,t=e.match(/iPhone|iPod/i);location.href.indexOf("#pc")===-1&&(t||e.indexOf("Android")>-1||e.indexOf("IEMobile")>-1)&&(isMobile=true)}catch(n){}})();
                if(isMobile){
                    var video = [this.src ? this.src : 'https://kakazy-yun.com/20190218/18344_48525b5a/index.m3u8'];
                    //var support = ['iPad', 'iPhone', 'ios', 'android+false', 'msie10+false'];
                    var support = ['all'];
                    CKobject.embedHTML5(this.videoid, 'ckplayer_' + this.videoid,'100%','100%',video,flashvars,support);

                }else{
                    CKobject.embedSWF('/static/ckplayer/ckplayer.swf', this.videoid, 'ckplayer_' + this.videoid, '100%', '100%', flashvars, params);
                }
                //var player = new ckplayer(videoObject);
            }
        }
    },
    watch:{
        'src':function(currVal,oldVal){
            if(currVal!==oldVal){
                this.src = currVal;
                this.playMovie();
            }
        }
    }
}
</script>
<style scoped>
    .ckplayer{
        width:100%;
        height:100%;
        position:relative;
    }
    .ckplayer > div{
        position:absolute;
        width:100%;
        height:100%;
    }
</style>