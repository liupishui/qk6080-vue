<template>
  <div class="tab-slider">
    <div
      ref="leftPage"
      class="tab-slider__out-of-screen tab-slider__out-of-screen--left">
      <component :is="leftComp"/>
    </div>
    <transition :name="transitionName">
      <router-view
        class="tab-slider__content"
        ref="currentPage"
        @touchstart.native="onTouchStart"
        @touchmove.native="onTouchMove"
        @touchend.native="onTouchEnd" :key="$route.fullpath">
      </router-view>
      <!--组件缓存介绍https://blog.csdn.net/qq_30114149/article/details/78415030-->
      <!--<keep-alive include="dianying">
        <router-view
          class="tab-slider__content"
          ref="currentPage"
          @touchstart.native="onTouchStart"
          @touchmove.native="onTouchMove"
          @touchend.native="onTouchEnd">
        </router-view>
      </keep-alive>-->
    </transition>
    <div
      ref="rightPage"
      class="tab-slider__out-of-screen tab-slider__out-of-screen--right">
      <component :is="rightCopm"/>
    </div>
  </div>
</template>

<script>
/***
 * 使用
 * <tab-slider
          class="foot-content-wrapper"
          :comp="compData"
        ></tab-slider>
        
      compData:[
        {
          name:'Dianying',
          path:'/dianying',
          component:require('@/pages/dianying').default
        },
        {
          name:'ManageIndex',
          path:'/manage/index',
          component:require('@/pages/manage/index').default
        },
        {
          name:'ManageIcon',
          path:'/manage/icon',
          component:require('@/pages/manage/icon').default
        }
      ]
 * 
 * ***/
import { translate } from '@/common/js/util.js'
export default {

  mounted() {
    this.maxMoveDistance = window.innerWidth
    this.minIndex = 0
    this.maxIndex = this.comp.length - 1 
    if (this.defaultIndex !== -1) {
      this.index = this.defaultIndex
      this.$router.push({name: this.comp[this.index].name})
    }
  },
  props: {
    dragSlide:Boolean,
    transition:{
        type:Boolean,
        default:true
    },
    comp: {
      type: Array,
      default() {
        return [{}]
      }
    },
    'default-index': {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      isDragedSlide: false, // 是否通过手指拖动触发滑屏切换路由
      index: 0,
      transitionName: '',
      touch: {},
      touchStartTime: 0,
      touchEndTime: 0,
      totalDiff: 0
    }
  },
  computed: {
    direction() { // 可滑动方向，指的是手指滑动的方向。左滑即页面右边有东西。
      if (this.index === this.minIndex) {
        return 'left'
      } else if (this.index === this.maxIndex) {
        return 'right'
      } else {
        return 'both'
      }
    },
    leftComp() {
      return this.dragSlide&&this.comp[this.index - 1] ? this.comp[this.index - 1].component : ''
    },
    rightCopm() {
      return this.dragSlide&&this.comp[this.index + 1] ? this.comp[this.index + 1].component : ''
    }
  },
  methods: {
    updateRouter(el, component) {
      if (this.isDragedSlide) {
        const { name, path } = component
        name ? this.$router.push({name:name}) : this.$router.push(path)
        el.style.transform = ''
        el.style.transitionDuration = '0s'
      }
    },
    onTouchStart(ev) {
        if(!this.dragSlide){
            return;
        }
      this.leftEl = this.$refs.leftPage ? this.$refs.leftPage : ''
      this.rightEl = this.$refs.rightPage ? this.$refs.rightPage : ''
      const touch = ev.changedTouches[0]
      this.touch.x1 = touch.pageX
      this.touchStartTime = Date.now()
    },
    onTouchMove(ev) { // 页面向左滑，totaldiff小于0
        if(!this.dragSlide){
            return;
        }
        ev.stopPropagation();
      const touch = ev.changedTouches[0]
      const el = ev.currentTarget
      this.touch.x2 = touch.pageX
      const diff = this.touch.x2 - this.touch.x1
      this.totalDiff = diff
      if (this.totalDiff > 0 && this.direction !== 'left') {
        translate(this.leftEl, this.totalDiff)
      } else if (this.totalDiff < 0 && this.direction !== 'right') {
        translate(this.rightEl, this.totalDiff)
      }
      if (this.totalDiff > 0) {
        if (this.direction === 'left') this.totalDiff = 0
        translate(this.leftEl, this.totalDiff)
      } else {
        if (this.direction === 'right') this.totalDiff = 0
        translate(this.rightEl, this.totalDiff)
      }
      translate(el, this.totalDiff, 0)
    },
    onTouchEnd(ev) {
        if(!this.dragSlide){
            return;
        }
      const touch = ev.changedTouches[0]
      this.touch.x2 = touch.pageX
      const diff = this.touch.x2 - this.touch.x1
      this.totalDiff = diff
      this.touchEndTime = Date.now()
      const el = ev.currentTarget
      const touchTime = this.touchEndTime - this.touchStartTime
      const direction = Math.sign(this.totalDiff)
      const target = direction === 1 ? this.leftEl : this.rightEl
      this.totalDiff = this.totalDiff > 0 && this.direction === 'left' ? 0 : this.totalDiff
      this.totalDiff = this.totalDiff < 0 && this.direction === 'right' ? 0 : this.totalDiff
      // 当滑动距离超过一半或者快速滑动一段距离时，就进行完整的滑动
      // 快速滑动的数据是自己尝试的，体验可能不是很好^ ^
      let moveDistance
      if (Math.abs(this.totalDiff) > this.maxMoveDistance / 2 || (touchTime < 150 && Math.abs(this.totalDiff) > this.maxMoveDistance / 10)) {
        moveDistance = direction * this.maxMoveDistance
        this.isDragedSlide = true
        setTimeout(() => {
          this.updateRouter(target, this.comp[this.index - direction])
        }, 200)
      } else {
        moveDistance = this.totalDiff = 0
      }
      translate(el, moveDistance, 0, {
        transitionDuration: '.2s'
      })
      translate(target, moveDistance, 0, {
        transitionDuration: '.2s'
      })
    }
  },
  watch: {
    $route(to, from) {
        if(!this.transition){
            return;
        }
      const fromIndex = this.comp.findIndex(comp => {
        return comp.name ? comp.name === from.name : new RegExp(`.*${comp.path}$`).test(from.path)
      })
      const toIndex = this.comp.findIndex(comp => {
        return comp.name ? comp.name === to.name : new RegExp(`.*${comp.path}$`).test(to.path)
      })
      this.index = toIndex
      if (this.isDragedSlide || fromIndex === -1) {
        this.transitionName = ''
        this.isDragedSlide = false
      } else {
        this.transitionName = fromIndex - toIndex > 0 ? 'slide-right' : 'slide-left'
      }
      this.$emit('success', to.name)
    }
  }
}
</script>

<style lang="scss">
.tab-slider {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  &__content {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow-x:hidden;
    &.slide-left-enter, &.slide-right-leave-to {
      transform: translateX(100%)
    }
    &.slide-left-enter-active, &.slide-left-leave-active {
      transition: transform linear .2s
    }
    &.slide-right-enter, &.slide-left-leave-to {
      transform: translateX(-100%)
    }
    &.slide-right-enter-active, &.slide-right-leave-active {
      transition: transform linear .2s
    }
  }
  &__out-of-screen {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-x:hidden;
    >:first-child {
      height: 100%;
    }
    &.tab-slider__out-of-screen--left {
      left: -100%;
    }
    &.tab-slider__out-of-screen--right {
      right: -100%;
    }
  }
}
</style>
