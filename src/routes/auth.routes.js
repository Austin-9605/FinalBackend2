import { Router } from "express";
import passport from "passport";

export const authRouter = Router();
console.log("auth activo")

authRouter.post("/register", passport.authenticate("register", { session: false }), (req, res) => {
    res.json(req.user);
});

authRouter.post("/login", passport.authenticate("login", { session: false }), (req, res) => {
    const token = req.token;

    res.cookie("token", token, {
        httpOnly:true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({ token });
});