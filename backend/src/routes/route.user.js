import { Router } from "express";
import { login, signUp } from "../controllers/controller.user";

export const userRoute = Router();

userRoute.post("/register", signUp);
userRoute.post("/login", login);