import { userModel } from "./models/user.model.js";
//
console.log("Cargando clase userManager");

export class userManager {
    //funcion GET
    static async getUsers() {
        return await userModel.find().lean();
    }


    //funcion GET:ID
    static async getUsersBy(filtro = {}) {
        return await userModel.findOne(filtro);
    }


    //funcion POST
    static async addUser(usuario = {}) {
        let nuevoUsuario = await userModel.create(usuario);
        return nuevoUsuario.toJSON()
    }


    //funcion PUT
    static async modifyUser(id, aModificar = {}) {
        return await userModel.findByIdAndUpdate(id)
    }


    //funcion DELETE
    static async deleteUser(id) {
        return await userModel.findByIdAndDelete(id)
    }
}

