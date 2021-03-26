<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ cartLength }})</div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import { mapGetters } from 'vuex'
  export default {
    name: "Cart",
    components: {NavBar},
    computed: {
      // 两种语法
      ...mapGetters(['cartLength'])
      // cartLength() {
      //   return this.$store.getters.cartLength
      // }
    }
  }
</script>

<style scoped>
.nav-bar{
  background-color: var(--color-tint);
  color: white;
}
</style>
