import { isValidObjectId } from "mongoose";
import { userService } from "../services/user.service.js";


export class UserController {
    //get
    async getUsers(req, res) {
        try {
            let usuarios = await userService.getUsers()
            res.setHeader("content-Type", "application/json");
            return res.status(200).json({ usuarios });

        } catch (error) {
            return res.status(500).send(`Error: ${error.message}`)
        }
    }

    //get uid
    async getUsersBy(req, res) {
        let id = req.params.uid

        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Indique un id válido de MongoDB" })
        }

        let usuario = await userService.getUsersBy({ _id: id })
        if (!usuario) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen Usuarios con id: ${id}` })
        }

        try {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ usuario });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `${error.message}` })
        }
    }

    //post user
    async addUser(req, res) {
        try {
            const usuario = req.body;
            const nuevoUsuario = await userService.addUser(usuario);
            res.status(201).json(nuevoUsuario)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //put user
    async modifyUser(req, res) {
        let id = req.params.uid

        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Indique un id válido de MongoDB" })
        }

        let usuario = await userService.getUsersBy({ _id: id })
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
            console.log("prop a modi:", aModificar); //Debug 1
            let usuarioModificado = await userService.modifyUser(id, aModificar)
            console.log("user modi:", usuarioModificado); //Debug 2
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
    }

    //delete user
    async deleteUser(req, res) {
        let id = req.params.uid

        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Indique un id válido de MongoDB" })
        }

        let usuario = await userService.getUsersBy({ _id: id })
        if (!usuario) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen Usuarios con id: ${id}` })
        }

        try {
            let usuarioEliminado = await userService.deleteUser(id)
            res.setHeader("Content-Type", "application/json")
            res.status(200).json({ usuarioEliminado });

        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error.message });
        }
    }
}

export const userController = new UserController();