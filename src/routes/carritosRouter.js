import { Router } from 'express';
import passport from "passport";
import { cartController } from '../controllers/cart.controller.js';
import { isUser } from "../middlewares/auth.middleware.js";

export const router = Router()
console.log("Ruta de carritos: Activa")

router.get("/", passport.authenticate("current", { session: false }), isUser, cartController.getCarts);
router.get("/:cid", passport.authenticate("current", { session: false }), isUser, cartController.getCartsBy);
router.post("/", passport.authenticate("current", { session: false }), cartController.addCart);
router.delete("/:cid", passport.authenticate("current", { session: false }), isUser, cartController.modifyCartToEmpty);
router.put("/:cid", passport.authenticate("current", { session: false }), isUser, cartController.modifyCart);
router.post("/:cid/products/:pid", passport.authenticate("current", { session: false }), isUser, cartController.addCartAndProduct);
router.delete("/:cid/products/:pid", passport.authenticate("current", { session: false }), isUser, cartController.deleteProductInCart)
router.put("/:cid/products/:pid", passport.authenticate("current", { session: false }), isUser, cartController.modifyCartQuantity)
router.post("/:cid", passport.authenticate("current", { session: false }), isUser, cartController.purchaseCart)


// Get / (obtener todos los carritos)
// Get /:cid (obtener carrito específico (cid))
// Post / (crear carrito vacio)
// Delete /:cid (vaciar carrito específico)
// Put /:cid
// Post /:cid/products/:pid (agregar prod a un carrito específico)
// Delete /:cid/products/:pid (eliminar prod de un carrito específico)
// Put /:cid/products/:pid (modificar cantidades de un producto en un carrito específico)

