import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { userDto } from "../dto/user.dto.js";

export const userRouter = Router();
console.log("Ruta de usuarios: Activa");

userRouter.get("/", userController.getUsers)
userRouter.get("/:uid", userController.getUsersBy)
userRouter.post("/", validate(userDto), userController.addUser)
userRouter.put("/:uid", userController.modifyUser)
userRouter.delete("/:uid", userController.deleteUser)


//get all
//get uid
//post user
//put user
//delete user