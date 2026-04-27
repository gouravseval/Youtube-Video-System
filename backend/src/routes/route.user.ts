import { Router, Request, Response, NextFunction } from "express";
import { userController } from "../controllers/controller.user.js";


export const userRoute = Router();

userRoute.post("/register", (req: Request, res: Response, next: NextFunction) => userController.signUp(req, res).catch(next));
userRoute.post("/login", (req: Request, res: Response, next: NextFunction) => userController.login(req, res).catch(next));
