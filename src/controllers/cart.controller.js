import { isValidObjectId } from "mongoose";
import { cartService } from "../services/cart.service.js";
import { productService } from "../services/product.service.js";
import { ticketService } from "../services/ticket.service.js";

export class CartController {

    async getCarts(req, res) {
        try {
            let carritos = await cartService.getCarts()
            res.setHeader("content-Type", "application/json");
            return res.status(200).json({ carritos });

        } catch (error) {
            return res.status(500).send(`Error: ${error.message}`)
        }
    }

    async getCartsBy(req, res) {
        let id = req.params.cid

        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Indique un id válido de MongoDB" })
        }

        let carrito = await cartService.getCartsBy({ _id: id })
        if (!carrito) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen Carritos con id: ${id}` })
        }

        try {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ carrito });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `${error.message}` })
        }
    }

    async addCart(req, res) {
        try {
            const nuevoCarrito = await cartService.addCart();
            res.status(201).json({ message: "Nuevo carrito creado", nuevoCarrito });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    //DELETE /:cid (vaciar el carrito) update
    async modifyCartToEmpty(req, res) {
        let id = req.params.cid

        if (!isValidObjectId(id)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "Indique un id válido de MongoDB para el carrito (cid)." });
        }

        try {
            let carrito = await cartService.getCartsBy({ _id: id });
            if (!carrito) {
                res.setHeader("Content-Type", "application/json");
                return res.status(400).json({ error: `No existen carritos con id: ${id}` });
            }

            carrito.products = [];
            let aModificar = carrito.products

            await cartService.modifyCart(id, { products: aModificar });

            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ message: "Todos los productos fueron eliminados del carrito.", carrito: carrito });
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
        }
    }

    //PUT MODIFICA
    async modifyCart(req, res) {
        const { cid } = req.params;
        const productos = req.body;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: "Indique un id válido de MongoDB para el carrito (cid)." });
        }

        if (!Array.isArray(productos)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un array de productos." });
        }

        const uniqueProducts = new Set();
        for (let producto of productos) {
            const { product, quantity } = producto;

            if (!isValidObjectId(product)) {
                return res.status(400).json({ error: "Indique un id válido de MongoDB para el producto (pid)." });
            }

            if (typeof quantity !== "number" || quantity <= 0) {
                return res.status(400).json({ error: `La cantidad del producto ${product} debe ser un número positivo.` });
            }

            const productoExiste = await productService.getProductsBy({ _id: product });
            if (!productoExiste) {
                return res.status(400).json({ error: `El producto con id ${product} no existe en la base de datos.` });
            }

            if (uniqueProducts.has(product)) {
                return res.status(400).json({ error: `El producto con id ${product} está duplicado en la solicitud.` });
            }
            uniqueProducts.add(product);
        }

        try {
            let carritoId = await cartService.getCartsBy({ _id: cid });
            if (!carritoId) {
                return res.status(400).json({ error: `No existen carritos con el id: ${cid}` });
            }

            carritoId.products = productos;

            await cartService.modifyCart(cid, { products: carritoId.products }, { new: true });

            return res.status(200).json({ message: "Productos del carrito actualizados exitosamente", carrito: carritoId });
        } catch (error) {
            console.error("Error al actualizar los productos del carrito:", error);
            return res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
        }
    }

    async addCartAndProduct(req, res) {
        const { cid } = req.params;
        const { pid } = req.params;

        if (!isValidObjectId(cid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "Indique un id válido de MongoDB para el carrito (cid)." });
        }
        if (!isValidObjectId(pid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "Indique un id válido de MongoDB para el producto (pid)." });
        }

        let carritoId = await cartService.getCartsBy({ _id: cid });
        if (!carritoId) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `No existen carritos con el id: ${cid}` });
        }

        let producto = await productService.getProductsBy({ _id: pid });
        if (!producto) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `No existen productos con el id: ${pid}` });
        }

        try {
            const productoEnCarrito = carritoId.products.find(p => p.product._id == pid);

            if (productoEnCarrito) {

                productoEnCarrito.quantity += 1;
            } else {

                carritoId.products.push({ product: pid, quantity: 1 });
            }

            await cartService.modifyCart(cid, { products: carritoId.products })

            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ message: "Producto agregado al carrito exitosamente", carrito: carritoId });
        } catch (error) {
            o
            console.error("Error al agregar producto al carrito:", error);
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
        }
    }

    async deleteProductInCart(req, res) {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "Indique un id válido de MongoDB para el carrito (cid)." });
        }
        if (!isValidObjectId(pid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "Indique un id válido de MongoDB para el producto (pid)." });
        }

        const productoExiste = await productService.getProductsBy({ _id: pid });
        if (!productoExiste) {
            return res.status(400).json({ error: `El producto con id ${pid} no existe en la base de datos.` });
        }

        const carrito = await cartService.getCartsBy({ _id: cid });
        if (!carrito) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `No existen carritos con el id: ${cid}` });
        }

        const productoEnCarrito = carrito.products.find(p => p.product._id == pid);
        if (!productoEnCarrito) {
            return res.status(404).json({ error: `El producto con id: ${pid} no está en el carrito.` });
        }

        try {
            if (productoEnCarrito.quantity > 1) {
                productoEnCarrito.quantity -= 1;

                await cartService.modifyCart(cid, { products: carrito.products });

                res.setHeader("Content-Type", "application/json");
                return res.status(200).json({
                    message: "Cantidad del producto ajustada exitosamente.",
                    producto: {
                        product: productoEnCarrito.product,
                        quantity: productoEnCarrito.quantity
                    }
                });

            } else {
                carrito.products = carrito.products.filter(p => p.product._id != pid);

                await cartService.modifyCart(cid, { products: carrito.products });

                res.setHeader("Content-Type", "application/json");
                return res.status(200).json({
                    message: "Producto eliminado del carrito.",
                    productoEliminado: productoEnCarrito.product
                });
            }
        } catch (error) {
            console.error("Error al ajustar/eliminar el producto del carrito:", error);
            return res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
        }
    }

    async modifyCartQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity, ...otrosCampos } = req.body;

        if (Object.keys(otrosCampos).length > 0) {
            return res.status(400).json({
                error: "Solo se permite modificar la propiedad 'quantity'. Otros campos no están permitidos.",
                camposNoPermitidos: Object.keys(otrosCampos)
            });
        }

        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({ error: "Debe proporcionar una cantidad válida (número positivo)." });
        }

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: "Indique un id válido de MongoDB para el carrito (cid)." });
        }
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: "Indique un id válido de MongoDB para el producto (pid)." });
        }

        try {
            let carrito = await cartService.getCartsBy({ _id: cid });
            if (!carrito) {
                return res.status(404).json({ error: `No existen carritos con el id: ${cid}` });
            }

            let producto = await productService.getProductsBy({ _id: pid });
            if (!producto) {
                return res.status(404).json({ error: `No existen productos con el id: ${pid}` });
            }

            const productoEnCarrito = carrito.products.find(p => p.product._id.toString() === pid);

            if (!productoEnCarrito) {
                return res.status(404).json({ error: `El producto con id ${pid} no está en el carrito con id ${cid}.` });
            }

            productoEnCarrito.quantity = quantity;

            await cartService.modifyCart(cid, { products: carrito.products });

            res.status(200).json({
                message: "Cantidad actualizada correctamente.",
                productoActualizado: { product: productoEnCarrito.product, quantity: productoEnCarrito.quantity }
            });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto:", error);
            res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
        }
    }

    //purchaste cart
    async purchaseCart(req, res) {
        const { cid } = req.params;
        const userEmail = req.user.email; 

        try {
            let carrito = await cartService.getCartsBy({ _id: cid });
            if (!carrito) {
                return res.status(404).json({ error: `No existen carritos con el id: ${cid}` });
            }

            const productsNotProcessed = [];
            const purchasedItems = [];
            let totalAmount = 0;

            for (let item of carrito.products) {
                const product = await productService.getProductsBy({ _id: item.product._id });
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await productService.modifyProduct(product._id, product);

                    purchasedItems.push({
                        productId: product._id,
                        quantity: item.quantity
                    });
                    totalAmount += product.price * item.quantity;
                } else {
                    productsNotProcessed.push(item.product._id);
                }
            }

            if (purchasedItems.length > 0) {
                const ticketData = {
                    purchaser: userEmail,
                    amount: totalAmount,
                    items: purchasedItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                    }))
                };

                const ticket = await ticketService.createTicket(ticketData);

                carrito.products = [];
                await cartService.modifyCart(cid, { products: carrito.products });

                res.json({
                    message: 'Compra finalizada',
                    ticket,
                    productsNotProcessed
                });



            } else {
                res.json({
                    message: 'No se pudieron procesar los productos, la compra no se completó.',
                    productsNotProcessed
                });
            }
        } catch (error) {
            console.error("Error al finalizar la compra:", error);
            res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
        }
    }
}

export const cartController = new CartController();