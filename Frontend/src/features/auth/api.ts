import { api } from "@/services/api";


interface loginPayload{
   email:string,
   password:string
}

export const loginUser=(values:loginPayload)=>{

    return api.post("/auth/login",values)
}

export const registerDoctor=(values:FormData)=>{
    return api.post("/doctor/signup",values,{
        headers:{
            "Content-Type":"multipart/form-data"
        },
    });
}

export const registerRep=(values:FormData)=>{
    return api.post("/rep/signup",values,{
        headers:{
            "Content-Type":"multipart/form-data"
        },
    })
}
