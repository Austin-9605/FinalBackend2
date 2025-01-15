
//

import { Router } from 'express'
// import { CartManager } from '../dao/cartManager.js'
import { CartMongoManager as cartManager } from '../dao/cartMongoManager.js';
import { ProductMongoManager as ProductManager } from '../dao/ProductMongoManager.js';
import { isValidObjectId } from 'mongoose';
import { carritoModelo } from '../dao/models/carritosModelo.js';
export const router = Router()

console.log("Ruta de carritos: Activa")

// NO es parte de la Consigna //
router.get("/", async (req, res) => {
    try {
        let carritos = await cartManager.getCarts()
        res.setHeader("content-Type", "application/json");
        return res.status(200).json({ carritos });

    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`)

    }
})
/////

router.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.addCart();
        res.status(201).json({ message: "Nuevo carrito creado", nuevoCarrito });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get cart by id (cid)
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Indique un id válido de MongoDB" })
    }

    let carrito = await cartManager.getCartsBy({ _id: cid })
    if (!carrito) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen Carritos con id: ${cid}` })
    }

    try {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ carrito });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${error.message}` })
    }

});

//DELETE /:cid (vaciar el carrito)
router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "Indique un id válido de MongoDB para el carrito (cid)." });
    }

    try {
        let carrito = await cartManager.getCartsBy({ _id: cid });
        if (!carrito) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `No existen carritos con id: ${cid}` });
        }

        carrito.products = [];

        await carritoModelo.findByIdAndUpdate(cid, { products: carrito.products });

        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ message: "Todos los productos fueron eliminados del carrito.", carrito: carrito });
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
    }
});

//PUT MODIFICADO
router.put("/:cid", async (req, res) => {
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

        const productoExiste = await ProductManager.getProductsBy({ _id: product });
        if (!productoExiste) {
            return res.status(400).json({ error: `El producto con id ${product} no existe en la base de datos.` });
        }

        if (uniqueProducts.has(product)) {
            return res.status(400).json({ error: `El producto con id ${product} está duplicado en la solicitud.` });
        }
        uniqueProducts.add(product);
    }

    try {
        let carritoId = await cartManager.getCartsBy({ _id: cid });
        if (!carritoId) {
            return res.status(400).json({ error: `No existen carritos con el id: ${cid}` });
        }

        carritoId.products = productos;

        await carritoModelo.findByIdAndUpdate(cid, { products: carritoId.products }, { new: true });

        return res.status(200).json({ message: "Productos del carrito actualizados exitosamente", carrito: carritoId });
    } catch (error) {
        console.error("Error al actualizar los productos del carrito:", error);
        return res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
    }
});


//cambio endpoint "/:cid/product/:pid" => "/:cid/products/:pid
// POST cid y pid //
router.post("/:cid/products/:pid", async (req, res) => {
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

    let carritoId = await cartManager.getCartsBy({ _id: cid });
    if (!carritoId) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `No existen carritos con el id: ${cid}` });
    }

    let producto = await ProductManager.getProductsBy({ _id: pid });
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

        await carritoModelo.findByIdAndUpdate(cid, { products: carritoId.products })

        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ message: "Producto agregado al carrito exitosamente", carrito: carritoId });
    } catch (error) {
        o
        console.error("Error al agregar producto al carrito:", error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
    }
});

//DELETE cid y pid
router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    if (!isValidObjectId(cid)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "Indique un id válido de MongoDB para el carrito (cid)." });
    }
    if (!isValidObjectId(pid)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "Indique un id válido de MongoDB para el producto (pid)." });
    }

    // Validar que el producto existe en la base de datos
    const productoExiste = await ProductManager.getProductsBy({ _id: pid });
    if (!productoExiste) {
        return res.status(400).json({ error: `El producto con id ${pid} no existe en la base de datos.` });
    }

    const carrito = await cartManager.getCartsBy({ _id: cid });
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

            await carritoModelo.findByIdAndUpdate(cid, { products: carrito.products });

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

            await carritoModelo.findByIdAndUpdate(cid, { products: carrito.products });

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
});

//PUT cid y pid
router.put("/:cid/products/:pid", async (req, res) => {
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
        let carrito = await cartManager.getCartsBy({ _id: cid });
        if (!carrito) {
            return res.status(404).json({ error: `No existen carritos con el id: ${cid}` });
        }

        let producto = await ProductManager.getProductsBy({ _id: pid });
        if (!producto) {
            return res.status(404).json({ error: `No existen productos con el id: ${pid}` });
        }

        const productoEnCarrito = carrito.products.find(p => p.product._id.toString() === pid);

        if (!productoEnCarrito) {
            return res.status(404).json({ error: `El producto con id ${pid} no está en el carrito con id ${cid}.` });
        }

        productoEnCarrito.quantity = quantity;

        await carritoModelo.findByIdAndUpdate(cid, { products: carrito.products });

        res.status(200).json({
            message: "Cantidad actualizada correctamente.",
            productoActualizado: { product: productoEnCarrito.product, quantity: productoEnCarrito.quantity }
        });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error);
        res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
    }
});

