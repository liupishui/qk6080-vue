<template>
    <div>

       <div class="swiper-container" :id="swiperId">
            <div class="swiper-wrapper">
            <div class="swiper-slide">
                <div width="100%;overflow-x:scroll;word-break:keepall;white-space: nowrap;">
                    fasdfaj据了解
                </div>
            </div>
            <div class="swiper-slide">Slide 2</div>
            <div class="swiper-slide">Slide 3</div>
            <div class="swiper-slide">Slide 4</div>
            <div class="swiper-slide">Slide 5</div>
            <div class="swiper-slide">
                <div style="width:200%">
                    sssssssssssssssssss
                </div>
            </div>
            <div class="swiper-slide" :id="swiperId1">
                    <div class="swiper-wrapper" style="height:400px;overflow-y:scroll;">
                        <div>

                        </div>
                    </div>
                <div class="swiper-scrollbar"></div>
            </div>
            <div class="swiper-slide">Slide 8</div>
            <div class="swiper-slide">Slide 9</div>
            <div class="swiper-slide">Slide 10</div>
            </div>
        </div>
        <div id="iSlider-wrapper"></div>

    </div>
</template>
<script>
    let Swiper = require('@/common/js/swiper/4.4.6/swiper.min.js').Swiper;
    let iSlider = require('@/common/iSlider.js').iSlider;
    export default {
        data(){
            return {
                swiperId:"swiper"+Math.random().toString().substr(2,4),
                swiperId1:"swiper"+Math.random().toString().substr(2,4)
            }
        },
        mounted(){
            var swiper = new Swiper('#'+this.swiperId,{
                nested:true,
                resistanceRatio:0
            });
            // var swiper = new Swiper('#'+this.swiperId1,{
            //     nested:true,
            //     resistanceRatio:0,
            //      direction: 'vertical',
            //     slidesPerView: 'auto',
            //     freeMode: true,
            //     scrollbar: {
            //         el: '.swiper-scrollbar',
            //     },
            //     mousewheel: true,
            // });

            var list = [
                    // HTML String
                    {
                        content: '<div style="font-size:4em;color:white;text-align: center">HTML String</div>'
                    },
                    // element
                    {
                        content: (function () {
                            var dom = document.createElement('div');
                            dom.innerHTML = 'Element';
                            dom.style.cssText = 'font-size:3em;color:rgb(230, 230, 63);';
                            return dom;
                        })()
                    },
                    // fragment
                    {
                        content: (function () {
                            var frag = document.createDocumentFragment();
                            var img = new Image()
                            var dom = document.createElement('div');
                            dom.innerHTML = 'Fragment';
                            dom.style.cssText = 'font-size:3em;color:rgb(230, 63, 230);';
                            frag.appendChild(dom);
                            return frag;
                        })()
                    },
                    // dom
                    {
                        content: document.querySelector('#hidden-space > p')
                    },
                    // iframe
                    {
                        content: '' +
                        '<div style="padding-top:.2em;font-size:3em;color:rgb(230, 63, 230);position:absolute;top:0;left:0;height:100%;width:100%;z-index:1">' +
                        '<span style="padding:.2em;background-color:black;">Iframe</span>' +
                        '</div>' +
                        '<iframe style="position:relative;z-index:0;height:100%;" src="http://mobile.baidu.com"></iframe>'
                    }
                ];

                new iSlider(document.getElementById('iSlider-wrapper'), list);

        }
    }
</script>
<style scoped>
    @import '../../common/js/swiper/4.4.6/swiper.min.css';
    .swiper-container {
      width: 100%;
      height: 100%;
    }
    .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #fff;

      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }

            #iSlider-wrapper {
            height: 100%;
            width: 100%;
            overflow: hidden;
            position: absolute;
        }

        #iSlider-wrapper ul {
            list-style: none;
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }

        #iSlider-wrapper li {
            position: absolute;
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-pack: center;
            -webkit-box-align: center;
            list-style: none;
        }

        #iSlider-wrapper li img {
            max-width: 100%;
            max-height: 100%;
        }
</style>
