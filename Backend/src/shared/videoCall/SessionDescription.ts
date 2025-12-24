export type SessionDescriptionType="offer" | "answer";

export interface SessionDescription{
    type:SessionDescriptionType;
    sdp:string;
}