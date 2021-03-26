<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" ref="tabControl1" :titles="['流行', '新款', '便宜']" @tabClick="tabClick" v-show="isTabFixed"></tab-control>

    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" @pullingUp="loadMore">
      <home-swiper :banners="banners" ref="swiper" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control ref="tabControl2" :titles="['流行', '新款', '便宜']" @tabClick="tabClick"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
<!--    <ul>-->
<!--      <li v-for="item in liNum">{{ item }}</li>-->
<!--    </ul>-->
  </div>
</template>

<script>

import Scroll from "../../components/common/scroll/Scroll";
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "../../components/content/backTop/BackTop";

import { debounce } from "../../common/utils";

import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import { getHomeMultidata, getHomeGoods } from "../../network/home";
  export default {
    name: "Home",
    components: {
      Scroll,
      NavBar,
      TabControl,
      GoodsList,
      HomeSwiper,
      RecommendView,
      FeatureView,
      BackTop
    },
    data() {
      return {
        saveY: null,

        isTabFixed: false,

        tabControlOffSetTop: null,

        isShowBackTop: true,

        liNum: [],
        result: null,

        banners: [],
        recommends: [],
        goods: {
          'pop': {
            page: 0,
            list: []
          },
          'new': {
            page: 0,
            list: []
          },
          'sell': {
            page: 0,
            list: []
          }
        },
        currentType: 'pop'
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1 请求多个数据
      this.getHomeMultidata()

      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      for (let i = 0; i < 20; i ++) {
        this.liNum.push(i)
      }
    },
    mounted() {
      // 图片加载防抖
      const refresh = debounce(this.$refs.scroll.refresh, 1000)
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })

    },
    destroyed() {
      console.log('home destroyed')
      // this.saveY = this.$refs.scroll.getScrollY()
    },
    activated() {
      this.saveY = this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.saveY = this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
      // 取消全局事件监听
      // this.$bus.$off('itemImgLoad', this.itemImageLister)
    },
    methods: {
      swiperImageLoad() {
        // 获取tabControl的对象
        this.tabControlOffSetTop = this.$refs.tabControl2.$el.offsetTop
        console.log(this.tabControlOffSetTop)
      },
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          console.log(res)
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()
        })
      },
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
        console.log('返回顶部')
      },
      contentScroll(position) {
        // 判断BackTop是否显示
        this.isShowBackTop = (-position.y > 1000)

        // 决定TabControl是否吸顶(position: fixed)

        this.isTabFixed = (-position.y > this.tabControlOffSetTop)
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      }
    },
  }
</script>

<style scoped>
#home{
  /*padding-top: 44px;*/
  /*padding-bottom: 49px;*/
  height: 100vh;
  position: relative;
}
.home-nav{
  background-color: var(--color-tint);
  color: #f6f6f6;

  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}
/*.wrapper{*/
/*  height: 100%;*/
/*}*/
.tab-control{
  position: relative;
  z-index: 9;
  /*position: sticky;*/
  /*top: 44px;*/
  /*z-index: 9;*/
  background-color: rgb(255, 255, 255);
}
.content{
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
}
.fixed{
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
}
</style>
