import UserManager from "../dao/database/userManager.js";

const userManager = new UserManager();

export default class userService {
  async getUserByEmail(email) {
    try {
      return await userManager.getUsersByEmail(email);
    } catch (error) {
      throw new Error("Error en capa de servicio", error);
    }
  }
}
