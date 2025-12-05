export interface IConnectionRequestLogRepository{
    getTodayRequestCount(repId:string):Promise<number>;
    incrementRequestCount(repId:string):Promise<void>;
    decrementRequestCount(repId:string):Promise<void>;
    resetDailyCount(repId:string):Promise<void>;
}