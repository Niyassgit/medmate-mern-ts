import { createSlice } from "@reduxjs/toolkit";

interface AuthState{
    user: any | null;
}

const initialState:AuthState={
    user:null,
}

const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user =action.payload;
        },
        logout:(state)=>{
            state.user=null;
        },
    },
});

export const { setUser,logout} =authSlice.actions;
export default authSlice.reducer;