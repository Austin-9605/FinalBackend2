import { userModel } from "./models/user.model.js";
//
console.log("Cargando clase userManager");

export class userManager {
    //funcion GET
    async getUsers() {
        return await userModel.find().lean();
    }


    //funcion GET:ID
    async getUsersBy(filtro = {}) {
        return await userModel.findOne(filtro);
    }


    //funcion POST
    async addUser(usuario = {}) {
        let nuevoUsuario = await userModel.create(usuario);
        return nuevoUsuario.toJSON()
    }


    //funcion PUT
    async modifyUser(id, aModificar = {}) {
        return await userModel.findByIdAndUpdate(id, aModificar, { new: true })
    }


    //funcion DELETE
    async deleteUser(id) {
        return await userModel.findByIdAndDelete(id)
    }
}

export const userDao = new userManager()