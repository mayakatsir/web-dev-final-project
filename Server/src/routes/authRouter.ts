import { Router } from "express";
import authController from "../controllers/authController";
import { upload } from "../middlewares/upload";

const userRouter = Router();

userRouter.post("/register", upload.single('avatar'), authController.register);

userRouter.post("/login", authController.login);

userRouter.post("/google", authController.googleLogin);

userRouter.post("/refresh-token", authController.refreshToken);

userRouter.post("/logout", authController.logout);

export default userRouter;