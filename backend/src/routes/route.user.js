import { Router } from "express";
import { userController } from "../controllers/controller.user.js";


export const userRoute = Router();

userRoute.post("/register", (req, res, next) => userController.signUp(req, res).catch(next));
userRoute.post("/login", (req, res, next) => userController.login(req, res).catch(next));