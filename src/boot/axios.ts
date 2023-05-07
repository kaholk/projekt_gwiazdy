import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Notify } from 'quasar'


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ 
  baseURL: process.env.ApiURL,
  auth: {
    username: process.env.ApiLogin as string,
    password: process.env.ApiPassword as string
  },
  timeout: 1000 * 8
});

interface IResponse<T>{
  responseData: T | undefined,
  responseError: string | undefined
}

const apiQuery = async <T>(apiMethod: "get" | "post" | "put" | "delete" | "patch", apiUrl: string, data?: any) =>{
  try{
    const response = await api.request<T>({
      method: apiMethod,
      url: apiUrl,
      data: data
    })
    return {
      responseData: response.data,
      responseError: undefined
    } as IResponse<T>
  }catch(error:any){
    const status = error.response.status
    let data = error.response.data
    let errorMessage
    
    if (typeof(data) == 'object'){
      errorMessage = data.message
    }
    else{
      errorMessage = `error: ${error.status} coś poszło nie tak`
    }

    // Notify.create(errorMessage)
    return {
      responseData: undefined,
      responseError: errorMessage
    } as IResponse<T>
  }
}


export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, apiQuery };

