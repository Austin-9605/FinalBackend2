import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { createToken, SECRET } from "../utils/jwt.utils.js";
import { userModel } from "../dao/models/user.model.js";
import { comparePassword } from "../utils/password.utils.js";


export function initializePassport() {
    //registro
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, email, password, done) => {
        console.log("SOY LA CONFIG DE PASSPORT")
        try {
            const { firstName, lastName, age, role, cartId } = req.body;

            if (!firstName || !lastName || !age) {
                return done(null, false, { message: "Campos incompletos" });
            }

            const user = await userModel.create({
                first_name: firstName,
                last_name: lastName,
                email,
                age,
                cartId,
                password,
                role,
            });

            return done(null, user);

        } catch (error) {
            return done(error)
        }
    }))

    //login
    passport.use("login", new LocalStrategy({
        usernameField: "email",
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const user = await userModel.findOne({ email });

            if (!user) return done(null, false, { message: "Usuario no encontrado" });

            const isValidPassword = await comparePassword(password, user.password)

            if (!isValidPassword) return done(null, false, { message: "La contraseña es incorrecta" });

            const token = createToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            req.token = token;

            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }));

    //current (jwt)
    passport.use("current", new JWTStrategy({
        secretOrKey: SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    }, async (payload, done) => {
        try {
            const user = await userModel.findById(payload.id);

            if (!user) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))



    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);

        if (!user) return done(null, false);
        return done(null, user);
    });
}


function cookieExtractor(req) {

    return req && req.cookies ? req.cookies.token : null;
}