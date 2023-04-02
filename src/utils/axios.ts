import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import useUserStore from '@/store/useUserStore';

import { toast } from './index';

// 回到登录界面
const toLoginPage = () => {
  localStorage.clear();
  window.location.replace(`/login?redirect=${window.location.pathname}`);
};

// 状态码映射到处理函数
const errorMap: Record<number, (msg?: HttpResError) => void> = {
  401: toLoginPage,
  403: () => toast('操作失败 无权限'),
  404: (msg?: HttpResError) => {
    toast(msg?.error || '【404】找不到资源');
  },
};

// 根据错误状态码进行分别处理
const errorHandle = (status: number, msg: HttpResError) => {
  // 状态码判断
  const handler = errorMap[status];
  if (handler) handler(msg);
  else {
    toast('系统错误 请稍后再试');
  }
};

const IS_PRD = import.meta.env.PROD; // vite环境变量
const { apiCfg } = window.CFG; // 在vite-env.d.ts中定义window interface
// 创建axios实例
const instance = axios.create({
  timeout: 1000 * 12,
  baseURL: IS_PRD ? apiCfg.prdHost : apiCfg.devHost,
});
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器（携带token）
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().token;
    token && (config.headers!.Authorization = `Bearer ${token}`);
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  (res: AxiosResponse) =>
    res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res),
  // 请求失败
  (error: AxiosError<HttpResError>) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      if (!window.navigator.onLine) {
        //  store.commit('changeNetwork', false)
      } else {
        return Promise.reject(error);
      }
    }
  },
);

export default instance;
