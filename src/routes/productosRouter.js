import { Router } from "express"
import passport from "passport";
import { productController } from "../controllers/product.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

export const router = Router()
console.log("Ruta de productos: Activa")

router.get("/", passport.authenticate("current", { session: false }), productController.getProductsPag);
router.get("/:pid", passport.authenticate("current", { session: false }), productController.getProductsBy);
router.post("/", passport.authenticate("current", { session: false }), isAdmin, productController.addProduct);
router.put("/:pid", passport.authenticate("current", { session: false }), isAdmin, productController.modifyProduct);
router.delete("/:pid", passport.authenticate("current", { session: false }), isAdmin, productController.deleteProduct);

//get all (paginate)
//get uid
//post product
//put product
//delete product



