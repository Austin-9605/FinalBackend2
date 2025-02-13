import { carritoModelo } from "./models/carritosModelo.js";
console.log("Cargando clase CartMongoManager")

export class CartMongoManager {

    // get
    async getCarts() {
        return await carritoModelo.find().lean()
    }

    //get by
    async getCartsBy(filtro = {}) {
        return await carritoModelo.findOne(filtro).populate("products.product");
    }

    // post cart vacio
    async addCart(cart = {}) {
        let nuevoCart = await carritoModelo.create(cart)
        return nuevoCart.toJSON()
    }

    //update
    async modifyCart(id, aModificar = {}) {
        return await carritoModelo.findByIdAndUpdate(id, aModificar, { new: true })
    }

    //delete
    async deleteCart(id) {
        return await carritoModelo.findByIdAndDelete(id)
    }
}

export const cartDao = new CartMongoManager();


