import fs from "fs"
console.log("Cargando clase ProductManager")

export class ProductManager {
    #path = " "
    constructor(rutaArchivo) {
        this.#path = rutaArchivo
    }

    async getProducts() {
        if (fs.existsSync(this.#path)) {
            return JSON.parse(await fs.promises.readFile(this.#path, { encoding: "utf-8" }))

        } else {
            return []
        }

    }

    async getProductById(id) {
        const productos = await this.getProducts();
        const producto = productos.find(producto => producto.id === id);
        if (!producto) {
            console.log(`${id} Not found`)
            return null
        } else {
            return producto
        }
    }

    async addProduct(producto = {}) {
        const productos = await this.getProducts();
        let id = 1
        if (productos.length > 0) {
            id = Math.max(...productos.map(d => d.id)) + 1
        }
        let nuevoProducto = {
            id,
            ...producto,
        }

        productos.push(nuevoProducto)
        await fs.promises.writeFile(this.#path, JSON.stringify(productos, null, 5));

        return nuevoProducto
    }

    async modifyProduct(id, modificaciones) {
        let productos = await this.getProducts()
        let indiceProducto = productos.findIndex(p=>p.id==id)
        if(indiceProducto===-1){
            throw new Error (`${id} not found`)
        }
        productos[indiceProducto]={
            ...productos[indiceProducto],
            ...modificaciones,
            id
        }

        await fs.promises.writeFile(this.#path, JSON.stringify(productos, null, 5));
        return productos[indiceProducto]
    }

    async deleteProduct(id){
        let productos = await this.getProducts()
        let productoEliminado = productos.filter(p=>p.id===id)
        productos=productos.filter(p=>p.id!==id)
        
        await fs.promises.writeFile(this.#path, JSON.stringify(productos, null, 5));
        return productoEliminado
    }

    
}



