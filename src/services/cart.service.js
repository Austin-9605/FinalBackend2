import { ticketService } from "./ticket.service.js";
import { cartDao } from "../dao/cartMongoManager.js";
import { productDao } from "../dao/ProductMongoManager.js";


class CartService {

    async getCarts() {
        return await cartDao.getCarts()
    }

    async getCartsBy(filtro = {}) {
        return await cartDao.getCartsBy(filtro)
    }

    async addCart(cart = {}) {
        return await cartDao.addCart(cart = {})
    }

    async modifyCart(id, aModificar = {}) {
        return await cartDao.modifyCart(id, aModificar, { new: true })
    }

    async deleteCart(id) {
        return await cartDao.deleteCart(id)
    }
}

export const cartService = new CartService();