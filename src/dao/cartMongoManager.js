import { carritoModelo } from "./models/carritosModelo.js"
console.log("Cargando clase CartMongoManager")

export class CartMongoManager {

    // get
    static async getCarts() {
        return await carritoModelo.find().lean()

    }

    static async getCartsBy(filtro = {}) {
        return await carritoModelo.findOne(filtro).populate("products.product");
    }

    // CREATE CART post cart vacio
    static async addCart(cart = {}) {
        let nuevoCart = await carritoModelo.create(cart)
        return nuevoCart.toJSON()
    }

}



