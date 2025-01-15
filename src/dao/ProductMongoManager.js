import { productoModelo } from "./models/productosModelo.js";
console.log("Cargando clase ProductMongoManager")

export class ProductMongoManager {

    //get
    static async getProductsPag(page = 1, limit = 10, sort = {}, filter = {}) {
        try {
            
            page = Math.max(1, parseInt(page));
            limit = Math.max(1, parseInt(limit));

            return await productoModelo.paginate(
                filter,
                { page, limit, lean: true, sort}
            );
        } catch (error) {
            console.error("Error al obtener productos paginados:", error);
            throw error;
        }
    }

////
static async getCategories(){
    try {
        const categories = await productoModelo.distinct("category");
        return categories
    } catch (error) {
        console.error("Error al obtener categorías:", error); 
        throw error
    }
}
////

    static async getProducts() {
        return await productoModelo.find().lean()


    }

    // get por id (prueba)
    static async getProductsBy(filtro = {}) {
        return await productoModelo.findOne(filtro)
    }
    //


    //post
    static async addProduct(producto = {}) {
        let nuevoProducto = await productoModelo.create(producto)
        return nuevoProducto.toJSON()


    }

    //update
    static async modifyProduct(id, aModificar = {}) {
        return await productoModelo.findByIdAndUpdate(id, aModificar, { new: true })
    }

    //delete
    static async deleteProduct(id) {
        return await productoModelo.findByIdAndDelete(id)
    }


}



