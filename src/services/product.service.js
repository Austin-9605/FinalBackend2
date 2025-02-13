import { productDao } from "../dao/ProductMongoManager.js"

class ProductService {

    async getProductsPag(page = 1, limit = 50, sort = {}, filter = {}) {
        return await productDao.getProductsPag(page = 1, limit = 50, sort = {}, filter = {})
    }

    async getCategories() {
        return await productDao.getCategories()
    }

    async getProducts() {
        return await productDao.getProducts()
    }

    async getProductsBy(filtro = {}) {
        return await productDao.getProductsBy(filtro)
    }

    async addProduct(producto = {}) {
        return await productDao.addProduct(producto)
    }

    async modifyProduct(id, aModificar = {}) {
        return await productDao.modifyProduct(id, aModificar, { new: true })
    }

    async deleteProduct(id) {
        return await productDao.deleteProduct(id)
    }
}

export const productService = new ProductService();