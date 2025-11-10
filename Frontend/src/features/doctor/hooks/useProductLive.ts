import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

type LikeToggledPayload={
    productId:string;
    counts:{like:number};
    liked:boolean;
    doctorId:string;
}

export function useProductLive(
    productId:string,
    token:string | null | undefined,
    onLikeCounts:(likes:number)=>void
){
    useEffect(()=>{
        if(!productId || !token) return;
        const socket=getSocket(token);
        socket.emit("room:join:product",{productId});
        const handleLikeToggled=(p:LikeToggledPayload)=>{
            if(p.productId===productId) onLikeCounts(p.counts.like);
        };
        socket.on("like:toggled",handleLikeToggled);
        return ()=>{
            socket.emit("room:leave:product",{productId});
            socket.off("like:toggled",handleLikeToggled);
        }
    },[productId,token,onLikeCounts]);
}