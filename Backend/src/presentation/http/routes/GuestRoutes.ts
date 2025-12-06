import { Router } from "express";

export class GuestRoutes{
    public router:Router;

    constructor(){
        this.router =Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/signup",)
    }
}