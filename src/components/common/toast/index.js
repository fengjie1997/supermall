const obj = {}
import Toast from "./Toast";
obj.install = function (Vue) {
  // document.body.appendChild(Toast.$el)
  // console.log('执行obj的install函数')
  // Vue.prototype.$toast = Toast

  // 创建组件构造器
  const toastContrustor = Vue.extend(Toast)
  // 2. new的方式。组件构造器可以创建组件对象
  const toast = new toastContrustor()

  // 3 将组件对象手动挂载至某一元素

  toast.$mount(document.createElement('div'))

  // 4 toast.$el对应的就是div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast

}


export default obj