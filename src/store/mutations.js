import { ADD_COUNTER, ADD_TO_CART } from "./mutations-types";

export default {
  // 购物车商品数量加1
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  // 添加商品至购物车
  [ADD_TO_CART](state, payload) {
    state.cartList.push(payload)
  }
}
