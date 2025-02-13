import express from "express"

import passport from "passport";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { initializePassport } from "./config/passport.config.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'

import { Server } from "socket.io"
import { router as productosRouter } from './routes/productosRouter.js'
import { router as carritosRouter } from './routes/carritosRouter.js'
import { router as vistasRouter } from "./routes/vistasRouter.js"
import { engine } from "express-handlebars"


import { conectaDB } from "./connDB.js"
import { CONFIG } from "./config/config.js";

//
const PORT = CONFIG.PORT
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

conectaDB(CONFIG.MONGO_URI, CONFIG.DB_NAME);

app.use("/api/auth", authRouter);
app.use("/api/users", passport.authenticate("current", { session: false }), userRouter);


app.get('/current', passport.authenticate("current", { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autorizado, no se encuentra un usuario logueado.' });
    }
    
    const { email, role } = req.user; 
    res.json({
        message: 'Usuario actual',
        email: email,  
        role: role     
    });
});

app.use(
    "/api/products",
    (req, res, next) => {
        req.serverSocket = io


        next()
    },
    productosRouter)


app.use("/api/carts", carritosRouter)


app.use(express.static(path.join(__dirname, 'public')));
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
// app.set("views", "./src/views")
app.set('views', path.join(__dirname, 'views'));

app.use("/", vistasRouter)

app.get("/", (req, res) => {
    res.setHeader("content-Type", "text/plain");
    res.status(200).send("OK");
})

const server = app.listen(CONFIG.PORT, () => {
    console.log(`Server escuchando en puerto ${CONFIG.PORT}`)
})

//- io config
const io = new Server(server) // const io=new Server(server)





