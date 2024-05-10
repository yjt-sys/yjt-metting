import axios, { AxiosInstance, AxiosRequestConfig,AxiosResponse } from "axios";
import {BASE_URL,TIMEOUT} from './config'

class HYRequest{
    instance: AxiosInstance;
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
            console.log(res);
            
            return res
        },err=>{
            return Promise.reject(err)
        })

    }
    request<T>(config: AxiosRequestConfig):Promise<AxiosResponse<T>>{
        return new Promise((resolve, reject) => {
            this.instance.request<AxiosResponse<T>>(config)
              .then((res) => {
                console.log(res);
                
                resolve(res.data)})
              .catch(err => reject(err));
          });
    }
    
    get<T>(config: AxiosRequestConfig):Promise<AxiosResponse<T>>{
        return this.request<T>({...config,method:"get"})
    }

    post<T>(config: AxiosRequestConfig):Promise<AxiosResponse<T>>{
        return this.request<T>({...config,method:"post"})
    }
}

export default new HYRequest(BASE_URL, TIMEOUT);