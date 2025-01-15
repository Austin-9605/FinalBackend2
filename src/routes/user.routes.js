import { Router } from "express";
import { userManager } from "../dao/userManager.js";
import { isValidObjectId } from "mongoose";

export const userRouter = Router();
console.log("Ruta de usuarios: Activa");


userRouter.get("/", async (req, res) => {
    try {
        let usuarios = await userManager.getUsers()
        res.setHeader("content-Type", "application/json");
        return res.status(200).json({ usuarios });


    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`)
    }
})

userRouter.delete("/:uid", async (req, res) => {
    let id = req.params.uid

    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Indique un id válido de MongoDB" })
    }

    let usuario = await userManager.getUsersBy({ _id: id })
    if (!usuario) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen Usuarios con id: ${id}` })
    }

    try {
        let usuarioEliminado = await userManager.deleteUser(id)

        res.setHeader("Content-Type", "application/json")
        res.status(200).json({ usuarioEliminado });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message });
    }
})

userRouter.put("/:uid", async (req, res) => {
    let id = req.params.uid

    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Indique un id válido de MongoDB" })
    }

    let usuario = await userManager.getUsersBy({ _id: id })
    if (!usuario) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen Usuarios con id: ${id}` })
    }

    let { ...aModificar } = req.body
    let cantPropsModificar = Object.keys(aModificar).length
    if (cantPropsModificar === 0) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `No se han ingresado propiedades para modificar` })
    }

    try {
            let usuarioModificado = await userManager.modifyUser(id, aModificar)
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ usuarioModificado })
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            })
        }
})