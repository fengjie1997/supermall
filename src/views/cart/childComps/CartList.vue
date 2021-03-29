<template>
  <div class="cart-list">
  <scroll class="content" :data="[cartList]">
    <cart-list-item v-for="item in cartList" :key="item.iid" :item-info="item"></cart-list-item>
  </scroll>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import CartBottomBar from "./CartBottomBar";
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'
  import { mapGetters } from 'vuex'
	export default {
		name: "CartList",
    components: {
		  Scroll, CartListItem, CartBottomBar
    },
    computed: {
		  ...mapGetters(['cartList'])
    }
    // props: {
		//   cartList: {
		//     type: Array,
    //     default() {
		//       return []
    //     }
    //   }
    // }
	}
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 49px - 40px);
  }
  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
