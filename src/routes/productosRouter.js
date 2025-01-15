import { Router } from 'express'
//// import { ProductManager } from '../dao/ProductManager.js'
import { ProductMongoManager as ProductManager } from '../dao/ProductMongoManager.js'
import { isValidObjectId } from 'mongoose';
export const router = Router()

console.log("Ruta de productos: Activa")

router.get("/", async (req, res) => {
    let { page, limit, sort, query } = req.query

    try {
        page = parseInt(page)
        limit = parseInt(limit)

        let sortOpciones = {}
        if (sort === "priceAsc") {
            sortOpciones = { price: 1 }
        } else if (sort === "priceDesc") {
            sortOpciones = { price: -1 }
        }

        //
        const categoriasExistentes = await ProductManager.getCategories()

        let filterOpciones = {}
        if (query) {
            if (categoriasExistentes.includes(query)){
                filterOpciones = {category: query}
            }else
            return res.status(400).json({
                status: "error", message: `Categoría "${query}" no encontrada`
            })
        }
        //
        const productos = await ProductManager.getProductsPag(page, limit, sortOpciones, filterOpciones);

        const response = {
            status: "success",
            payload: productos.docs,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?page=${productos.prevPage}` : null,
            nextLink: productos.hasNextPage ? `/api/products?page=${productos.nextPage}` : null,
        };

        res.setHeader("Content-Type", "application/json");
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: `Error fetching products: ${error.message}`,
        });
    }
});


router.get("/:pid", async (req, res) => {
    let id = req.params.pid

    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Indique un id válido de MongoDB" })
    }
    
    let producto = await ProductManager.getProductsBy({ _id: id })
    if (!producto) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen Productos con id: ${id}` })
    }
    
    try {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ producto });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${error.message}` })
    }
})


router.post("/", async (req, res) => {
    let { title, id, _id, description, code, price, status, stock, category, ...otros } = req.body;
    // ... operador "rest"

    if (id || _id) { return res.status(400).send({ message: "El id no debe ser indicado." }); }

    if (!title) {
        return res.status(400).send({ message: `title es requerido.` })
    }
    if (!description) {
        return res.status(400).send({ message: "La descripción es requerida." });
    }
    if (!code) {
        return res.status(400).send({ message: "El código es requerido." });
    }
    if (!price) {
        return res.status(400).send({ message: "El precio es requerido." });
    }
    if (!stock) {
        return res.status(400).send({ message: "El stock es requerido." });
    }
    if (!category) {
        return res.status(400).send({ message: "El category es requerido." });
    }
    if (!status) {
        return res.status(400).send({ message: "El status es requerido." });
    }
    
    let productos = await ProductManager.getProducts()
    let productoExistente = productos.find(producto => producto.code === code);
    if (productoExistente) {
        return res.status(400).send({ message: `Ya existe un producto con el código ${code} en la DB. Intenta con otro.` });
    }
    
    try {


        let nuevoProducto = await ProductManager.addProduct({ title, description, code, price, status, stock, category, ...otros })

        req.serverSocket.emit("nuevoProducto", nuevoProducto)


        res.setHeader("Content-Type", "application/json");
        return res.status(201).json({ nuevoProducto })

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

})


router.put("/:pid", async (req, res) => {
    let id = req.params.pid

    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Indique un id válido de MongoDB" })
    }

    let producto = await ProductManager.getProductsBy({ _id: id })
    if (!producto) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen Productos con id: ${id}` })
    }

    let { ...aModificar } = req.body
    let cantPropsModificar = Object.keys(aModificar).length
    if (cantPropsModificar === 0) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `No se han ingresado propiedades para modificar` })
    }

    try {
        let productoModificado = await ProductManager.modifyProduct(id, aModificar)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ productoModificado })
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`
        })
    }
})


router.delete("/:pid", async (req, res) => {
    let id = req.params.pid

    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Indique un id válido de MongoDB" })
    }

    let producto = await ProductManager.getProductsBy({ _id: id })
    if (!producto) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen Productos con id: ${id}` })
    }

    try {
        let productoEliminado = await ProductManager.deleteProduct(id)

        req.serverSocket.emit("productoEliminado", productoEliminado);


        res.setHeader("Content-Type", "application/json")
        res.status(200).json({ productoEliminado });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message });
    }
});



