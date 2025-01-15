import fs from "fs"
console.log("Cargando clase CartManager")

export class CartManager {
    #path = " "
    constructor(rutaArchivo) {
        this.#path = rutaArchivo
    }

    async getCarts() {
        if (fs.existsSync(this.#path)) {
            return JSON.parse(await fs.promises.readFile(this.#path, { encoding: "utf-8" }))

        } else {
            return []
        }

    }

    //cid
    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        if (!cart) {
            console.log(`Carrito con id ${id} no encontrado.`)
            return null
        } else {
            return cart
        }
    }

    async addCart(cart = {}) {
        const carts = await this.getCarts();
        let id = 1
        if (carts.length > 0) {
            id = Math.max(...carts.map(d => d.id)) + 1
        }
        const nuevoCart = {
            id,
            products: []
        };

        carts.push(nuevoCart)
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 5));

        return nuevoCart
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cid);

        if (cartIndex === -1) {
            throw new Error(`Carrito con id ${cid} no encontrado.`);
        }

        const cart = carts[cartIndex];
        const productoEnCart = cart.products.find(p => p.product === pid);

        if (productoEnCart) {
            productoEnCart.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        carts[cartIndex] = cart;
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 5));

        return cart;
    }
}



