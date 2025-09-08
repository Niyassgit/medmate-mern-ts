export interface IGoogleAuthService{
    verifyIdToken(idToken:string):Promise<{email:string,providerId:string}>
}