import { productoModelo } from "./models/productosModelo.js";
import { paginate } from "mongoose-paginate-v2";
console.log("Cargando clase ProductMongoManager")

export class ProductMongoManager {

    //get
    async getProductsPag(page = 1, limit = 50, sort = {}, filter = {}) {
        try {

            page = Math.max(1, parseInt(page));
            limit = Math.max(1, parseInt(limit));

            return await productoModelo.paginate(
                filter,
                { page, limit, lean: true, sort }
            );
        } catch (error) {
            console.error("Error al obtener productos paginados:", error);
            throw error;
        }
    }

    ////
    async getCategories() {
        try {
            const categories = await productoModelo.distinct("category");
            return categories
        } catch (error) {
            console.error("Error al obtener categorías:", error);
            throw error
        }
    }
    ////

    // get tradicional
    async getProducts() {
        return await productoModelo.find().lean()
    }

    // get by
    async getProductsBy(filtro = {}) {
        return await productoModelo.findOne(filtro)
    }

    //post
    async addProduct(producto = {}) {
        let nuevoProducto = await productoModelo.create(producto)
        return nuevoProducto.toJSON()


    }

    //update
    async modifyProduct(id, aModificar = {}) {
        return await productoModelo.findByIdAndUpdate(id, aModificar, { new: true })
    }

    //delete
    async deleteProduct(id) {
        return await productoModelo.findByIdAndDelete(id)
    }

}

export const productDao = new ProductMongoManager();


