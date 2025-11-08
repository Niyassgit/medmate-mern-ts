import { Server } from "socket.io";
import type {Server as HttpServer} from "http";
import jwt  from "jsonwebtoken";
import { env } from "../config/env";
import { UnautharizedError } from "../../application/errors";
import { ErrorMessages } from "../../shared/Messages";


export let io:Server;

export function initSocket(server:HttpServer){
    io=new Server(server,{
        cors:{origin:env.origin.split(",") ?? true,credentials:true},
    });
    io.use((socket,next)=>{
        try {
            const token=(socket.handshake.auth?.token as string)||
            (socket.handshake.headers.authorization?.toString().replace("Bearer",""));
            if(!token) return next(new UnautharizedError(ErrorMessages.UNAUTHORIZED));
            const user =jwt.verify(token,env.access_token) as {id:string; role: "doctor" |"rep"|"admin"};
            (socket as any).user =user;
            next();
        } catch (error) {
            next (new UnautharizedError(ErrorMessages.UNAUTHORIZED));
        }
    });
    io.on("connection",(socket)=>{
        const user=(socket as any).user as {id:string};
        socket.join(`user:${user.id}`);
        socket.on("room:join:product",({productId}:{productId:string})=>{
            socket.join(`product:${productId}`);
        });
        socket.on("room:leave:product",({productId}:{productId:string})=>{
            socket.leave(`product:${productId}`);
        });
    });
    return io;
}