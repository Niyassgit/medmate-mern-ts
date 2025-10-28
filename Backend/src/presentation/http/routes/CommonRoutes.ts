import { Router } from "express";
import { commonController } from "../../../infrastructure/di/CommonDi";
export class CommonRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoute();
  }
  initializeRoute(){
    this.router.get("/departments",commonController.departments);
    this.router.get("/territories",commonController.territories);
  }
}
