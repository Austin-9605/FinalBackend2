import { Router } from "express";
import passport from "passport";
import { validate } from "../middlewares/validate.middleware.js";
import { loginDto } from "../dto/auth.dto.js";
import { userDto } from "../dto/user.dto.js";




export const authRouter = Router();
console.log("auth activo")


authRouter.post("/register", passport.authenticate("register", { session: false }), (req, res) => {
    res.json(req.user);
});

//login con middleware
authRouter.post("/login", validate(loginDto),  passport.authenticate("login", { session: false }), (req, res) => {
    const token = req.token;

    res.cookie("token", token, {
        httpOnly:true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({ token });
});