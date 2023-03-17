import axios from "axios";
import qs from "qs";
import { allowedList, DOMAIN } from "./config.js";

// 导入路由
import router from "../../router";

const AxiosRequest = axios.create({
  baseURL: DOMAIN,
  timeout: 60000, // 超时时间
});
// 设置请求拦截器
// AxiosRequest.defaults.withCredentials = true
AxiosRequest.interceptors.request.use(
  (config) => {
    // 白名单查询
    if (!allowedList.has(config.url)) {
      // 获取token
      const token = localStorage.getItem("token");
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // if (!config.headers["content-type"]) {
    //   // 如果没有设置请求头
    //   if (config.method === "post") {
    //     config.headers["content-type"] =
    //       "application/x-www-form-urlencoded;charset=UTF-8"; // post 请求
    //     config.data = qs.stringify(config.data); // 序列化,比如表单数据
    //   }
    //   else {
    //     config.headers["content-type"] = "application/json"; // 默认类型
    //   }
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 设置响应拦截器
AxiosRequest.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    let message = "";
    if (error && error.response) {
      // 根据状态码结合路由进行处理
      switch (error.response.status) {
        case 302:
          message = "接口重定向";
          break;
        case 401: {
          message = "用户未登录或登录过期";
          router.push({
            name:"login"
          })
        }
          break;
        case 403:
          message = "您没有操作权限";
        case 404:
          message = "接口未找到";
        case 405:
          message = "Method not Allowed";
          break;
        default:
          message = "服务器异常";
          break;
      }
    }
    return Promise.reject(message);
  }
);

export default AxiosRequest;
