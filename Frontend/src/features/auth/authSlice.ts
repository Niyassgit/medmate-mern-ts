import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    accessToken: string | null;
    role:string | null;
}

const initialState:AuthState={
    accessToken:localStorage.getItem("accessToken"),
    role:localStorage.getItem("role"),
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state,action:PayloadAction<{token:string;role:string}>)=>{
            state.accessToken =action.payload.token;
            state.role=action.payload.role;

            localStorage.setItem("accessToken",action.payload.token);
            localStorage.setItem("role",action.payload.role);
        },

        logout:(state)=>{
            state.accessToken=null;
            state.role=null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
        },
    },
});

export const { login,logout} =authSlice.actions;
export default authSlice.reducer;