<template>
  <div style="height:100%">
    <yd-layout>
      <yd-navbar slot="navbar" :title="NavBar">
        <router-link to="#" slot="left" :class="'btn_back'">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
      </yd-navbar>
      <router-view></router-view>
      <yd-tabbar slot="tabbar">
        <yd-tabbar-item
          title="电影"
          link="/vue/dianying/dianying"
          exact
          :active="YdTabbarActive=='电影'"
        >
          <yd-icon name="home" slot="icon"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="电视剧" link="/vue/dianying/dianshiju" :active="YdTabbarActive=='电视剧'">
          <yd-icon name="shopcart-outline" slot="icon"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="综艺" link="/vue/dianying/zongyi" :active="YdTabbarActive=='综艺'">
          <yd-icon name="ucenter-outline" slot="icon"></yd-icon>
        </yd-tabbar-item>
      </yd-tabbar>
    </yd-layout>
    <transition name="sliderloading">
      <div
        :style="{background:'#00ffe7','box-shadow':'0 0 2px #333',position:'fixed',width:'100%',height:'6px','z-index':99999,top:'2px',left:0}"
        v-if="loadings"
      ></div>
    </transition>
  </div>
</template>
<script>
import { mapState, Store } from "vuex";
import { setTimeout } from "timers";
import { request } from "http";
export default {
  name: "App",
  data() {
    return {
      NavBar: "电影",
      exact: false,
      YdTabbarActive: "电影",
      loadings: false
    };
  },
  computed: {
    ...mapState({
      loading: state => {
        return state.Loading.loading;
      },
      Childpageslider: state => {
        return state.Childpageslider.sliders;
      }
    })
  },
  mounted: function() {
    // alert(window.outerWidth+'||'+window.outerHeight)
    let that = this;
    $(".btn_back").click(function(e) {
      e.preventDefault();
      that.$router.go(-2);
    });
    switch (this.$route.path) {
      case "/vue/dianying/dianying":
        {
          this.NavBar = "电影";
          this.YdTabbarActive = "电影";
        }
        break;
      case "/vue/dianying/dianshiju":
        {
          this.NavBar = "电视剧";
          this.YdTabbarActive = "电视剧";
        }
        break;
      case "/vue/dianying/zongyi": {
        this.NavBar = "综艺";
        this.YdTabbarActive = "综艺";
      }
    }
    // this.$route.matched.forEach((matchRoute,k)=>{
    //   //挂载组件时，给tabbar能正确匹配路由的链接加上选种样式
    //   console.log(matchRoute)
    //   for(let routeName in this.$data.YdTabbarActive){
    //     if(matchRoute.name==routeName){
    //       this.$data.YdTabbarActive[routeName]=true
    //     }
    //   }
    // });
  },
  methods: {
    navBack(event) {
      console.log(event);
      this.$router.go(-1);
    }
  },
  watch: {
    loading(to, from) {
      if (!to) {
        setTimeout(() => {
          this.loadings = false;
        }, 400);
      } else {
        this.loadings = true;
      }
    },
    Childpageslider: {
      handler(to, from) {
        //console.log('app',to)
        to.dianying.info.forEach(Element => {
          if (Element.active) {
            //console.log(Element);
            switch (Element.name) {
              case "DianyingDianying":
                {
                  this.NavBar = "电影";
                  this.YdTabbarActive = "电影";
                }
                break;
              case "DianyingDianshiju":
                {
                  this.NavBar = "电视剧";
                  this.YdTabbarActive = "电视剧";
                }
                break;
              case "DianyingZongyi": {
                this.NavBar = "综艺";
                this.YdTabbarActive = "综艺";
              }
            }
          }
        });
      },
      deep: true
    },
    $route(to, from) {
      // //路由切换时，给tabbar能正确匹配路由的链接加上选种样式
      // for(let routeName in this.$data.YdTabbarActive){
      //   this.$data.YdTabbarActive[routeName]=false
      // }
      // //console.log(this.NavBar=to.name);
      // this.$data.YdTabbarActive[to.name]=true
      // // const toDepth = to.path.split('/').length
      // // const fromDepth = from.path.split('/').length
      // // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  }
};
</script>
<style lang="less" scoped>
@font-face {
  font-family: "iconfont"; /* project id 1046152 */
  src: url("//at.alicdn.com/t/font_1046152_dvjcaaokc9g.eot");
  src: url("//at.alicdn.com/t/font_1046152_dvjcaaokc9g.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_1046152_dvjcaaokc9g.woff2") format("woff2"),
    url("//at.alicdn.com/t/font_1046152_dvjcaaokc9g.woff") format("woff"),
    url("//at.alicdn.com/t/font_1046152_dvjcaaokc9g.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_1046152_dvjcaaokc9g.svg#iconfont") format("svg");
}
.foot-content-wrapper {
  height: 100%;
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  height: 100%;
}
/deep/ .yd-scrollview:after {
  height: 0 !important;
}
/deep/ .yd-scrollview {
  height: calc(100vh - 1rem - 1.12rem);
}
.yd-scrollview:after {
  height: 0;
}
.yd-tabbar-active {
  color: #09bb07;
}
.sliderloading-enter-active {
  transition: left 0.8s;
}
.sliderloading-leave-active {
  transition: left 0.2s;
}
.sliderloading-enter /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(-100%);
}
.sliderloading-enter-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(-40%);
}
.sliderloading-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(100%);
}
</style>
