<template>
  <div id="detail">
    <detail-nav-bar ref="nav" @titleClick="detailNavBarClick" class="detail-nav-bar"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll">
      <div>
        {{ $store.state.cartList.length }}
      </div>
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import GoodsList from "../../components/content/goods/GoodsList";
import Scroll from "../../components/common/scroll/Scroll";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import { getDetail, Goods, Shop, GoodsParam, getRecommend } from "../../network/detail";
import DetailNavBar from "./childComps/DetailNavBar";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import { debounce } from "../../common/utils";
import { itemListenerMinxin } from "../../common/mixin";

import BackTop from "../../components/content/backTop/BackTop";

import DetailBottomBar from "./childComps/DetailBottomBar";
export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    BackTop
  },
  mixins: [itemListenerMinxin],
  data() {
    return {
      isShowBackTop: false,
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      itemImgListener: null,
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: undefined
    }
  },
  created() {
    // 保存传入的iid
    this.iid = this.$route.params.iid
// 请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.result
    //  获取轮播图数据
      this.topImages= data.itemInfo.topImages
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)


      this.shop = new Shop(data.shopInfo)

      this.detailInfo = data.detailInfo

// 5 获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      // 根据最新的数据，对应的dom渲染完成，但是存在图片未加载的情况
      this.$nextTick(() => {
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs)
      })
      // 4 给getThemeY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        console.log(this.themeTopYs)
      }, 1000)
    })
    // 请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
  },
  mounted() {
  },
  updated() {
    // this.themeTopYs = []

  },
  // mounted() {
  //   let newRefresh = debounce(this.$refs.scroll.refresh, 100)recomment
  //
  //   this.itemImgListener = () => {
  //     newRefresh()
  //   }
  //   this.$bus.$on('itemImgLoad', this.itemImgListener)
  // },
  // destroyed() {
  //   this.$bus.$off('itemImgLoad', this.itemImgListener)
  // },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()

      this.getThemeTopY()
    },
    detailNavBarClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    contentScroll(position) {
      const positionY = -position.y
      let length = this.themeTopYs.length
      // console.log(positionY)
      for (let i = 0; i < length; i++) {
        // console.log(this.currentIndex)
        if (this.currentIndex !== i && ( (i < length -1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length -1 && positionY > this.themeTopYs[i]))) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      // 3 是否显示回到顶部
      this.isShowBackTop = positionY > 1000
      console.log(positionY)
      console.log(this.isShowBackTop)
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
      console.log('返回顶部')
    },
    addToCart() {
      // 购物车需要展示的信息
      console.log('点击购物车')
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.newPrice
      product.iid = this.iid

      // 商品添加购物车
      this.$store.dispatch('addCart', product)

    }
  }
}
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content{
  height: calc(100% - 44px - 53px);
}
.detail-nav-bar{
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>