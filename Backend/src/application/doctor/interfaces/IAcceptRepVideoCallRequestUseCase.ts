import { SessionDescription } from "../../../shared/videoCall/SessionDescription";

export interface IAcceptRepVideoCallRequestUseCase{
    execute(repId:string,answer:SessionDescription,userId?:string):Promise<void>;
}