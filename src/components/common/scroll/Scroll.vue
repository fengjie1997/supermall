<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 3
    },
    pullUpLoad: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isPullUpLoad: true,
      scroll: null
    }
  },
  mounted() {
    // 1 创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
      click: true
    })
    // this.scroll.scrollTo(0, 0)

    // 2 监听滚动的位置
    this.scroll.on('scroll', (position) => {
      this.$emit('scroll', position)
    })

    // 3 监听上拉加载事件
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }

  },
  methods: {
    // 还原滚动
    scrollTo(x, y, time=300) {
      this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      if (this.scroll) {
        console.log('触发上拉加载')
        this.scroll.finishPullUp()
        this.scroll.refresh()
      }
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : null
    }
  }
}
</script>

<style scoped>

</style>