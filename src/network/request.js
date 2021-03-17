import axios from "axios";

export function request(config) {
  // 1 创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  })
  // 2 拦截器

  // 2.1 请求拦截
  instance.interceptors.request.use(config => {
    // console.log(config)
    // 1 config的一些信息不符合服务器的要求
    // 2 每次发送网络请求时，希望出现一个图标
    // 3 某些网络请求,必须携带一些信息, 比如token
    return config
  }, err => {
    console.log(err)
  });
  // 2.2 响应拦截
  instance.interceptors.response.use(res => {
    return res.data
    // console.log(res)
  }, error => {
    console.log(error)
  })
  return instance(config)
}

