import UserManager from "../dao/database/userManager.js";
import { logger } from "../utils/logger.js";

const userManager = new UserManager();

export default class userService {
  async getUserByEmail(email) {
    try {
      return await userManager.getUsersByEmail(email);
    } catch (error) {
      throw new Error("Error en capa de servicio", error);
    }
  }

  async updateLastConnection(id, lastConnection) {
    try {
      return await userManager.updateLastConnection(id, lastConnection);
    } catch (err) {
      logger.error("error en capa de servicio", err);
      throw new Error(err);
    }
  }

  async getUserById(id) {
    try {
      return await userManager.getUserById(id);
    } catch (err) {
      logger.error("error en capa de servicio", err);
      throw new Error(err);
    }
  }
}
