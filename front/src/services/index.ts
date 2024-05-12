import axios, { AxiosInstance, AxiosRequestConfig,AxiosPromise } from "axios";
import {BASE_URL,TIMEOUT} from './config'

class HYRequest{
    private instance: AxiosInstance;
    constructor(baseURL: string, timeout: number){
        this.instance = axios.create({
            baseURL,
            timeout
        })

        this.instance.interceptors.request.use(config=>{
            return config
        },err=>{
            return Promise.reject(err)
        })
        //响应拦截，只返回data
        this.instance.interceptors.response.use(res=>{
            return res
        },err=>{
            return Promise.reject(err)
        })

    }
    request<T>(config: AxiosRequestConfig):AxiosPromise<T>{
        return this.instance.request(config)
    }
    
    get<T>(config: AxiosRequestConfig):AxiosPromise<T>{
        return this.request({...config,method:"get"})
    }

    post<T>(config: AxiosRequestConfig):AxiosPromise<T>{
        return this.request({...config,method:"post"})
    }
}

export default new HYRequest(BASE_URL, TIMEOUT);