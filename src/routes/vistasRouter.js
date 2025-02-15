import { Router } from 'express'
import { isValidObjectId } from 'mongoose';
import { productService } from '../services/product.service.js';
import { cartService } from '../services/cart.service.js';
import passport from 'passport';

export const router = Router()

router.get("/products", async (req, res) => {
    let { page, limit, sort, query } = req.query

    try {
        
        let sortOpciones = {}
        if (sort === "priceAsc") {
            sortOpciones = { price: 1 }
        } else if (sort === "priceDesc") {
            sortOpciones = { price: -1 }
        }

        //
        const categoriasExistentes = await productService.getCategories()

        let filterOpciones = {}
        if (query) {
            if (categoriasExistentes.includes(query)){
                filterOpciones = {category: query}
            }else
            return res.status(400).json({
                status: "error", message: `Categoría "${query}" no encontrada`
            })
        }
        
        
        let { docs: products, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = await productService.getProductsPag(page, limit, sortOpciones, filterOpciones)
        let carritos = await cartService.getCarts()

        res.render("index", {
            products,
            totalPages,
            hasNextPage,
            hasPrevPage,
            prevPage,
            nextPage,
            carritos
        })
    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`)

    }
})

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Indique un id válido de MongoDB" })
    }

    try {
        let carrito = await cartService.getCartsBy({ _id: cid })
        if (!carrito) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen Carritos con id: ${cid}` })
        }

        const productosParaVista = carrito.products.map(item => ({
            productTitle: item.product.title,
            quantity: item.quantity,

        }));

        res.render("cart", { carrito: productosParaVista, cid });

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${error.message}` })
    }

});



//
router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {})
})




