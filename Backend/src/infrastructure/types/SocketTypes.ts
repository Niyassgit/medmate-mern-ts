import { Socket } from "socket.io";

export interface AuthenticatedUser {
  id: string;
  role: "doctor" | "rep" | "admin";
}

export interface AuthenticatedSocket extends Socket {
  user?: AuthenticatedUser;
}
