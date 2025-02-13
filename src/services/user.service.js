import { userDao } from "../dao/userManager.js";

class UserService {
    async getUsers() {
        return await userDao.getUsers()
    }

    async getUsersBy(filtro = {}) {
        return await userDao.getUsersBy(filtro)
    }

    async addUser(usuario = {}) {
        return await userDao.addUser(usuario)
    }

    async modifyUser(id, aModificar = {}) {
        return await userDao.modifyUser(id, aModificar, { new: true })
    }

    async deleteUser(id) {
        return await userDao.deleteUser(id)
    }
}

export const userService = new UserService();