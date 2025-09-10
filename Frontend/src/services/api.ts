import axios from "axios";
import { refreshAccessToken } from "@/features/auth/api";


export const api =axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true,
});


// api.interceptors.request.use((config) =>{
//     const token =localStorage.getItem("token");

//     if(token){
//         config.headers.Authorization=`Bearer ${token}`;
//     }
//     return config;
// });



api.interceptors.request.use((config) =>{
    const token =localStorage.getItem("accessToken");

    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest=error.config;

        if(error.response?.status===401 && !originalRequest._retry){
            originalRequest._retry=true;
        

        try {
            const newToken=await refreshAccessToken();
            originalRequest.headers.Authorization=`Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
             console.error("Refresh token failed:", refreshError);
        }
    }
    return Promise.reject(error);
    }
)