import UserManager from "../dao/database/userManager.js";
import { logger } from "../utils/logger.js";

const userManager = new UserManager();

export default class userService {
  async getAllUsers() {
    try {
      return await userManager.getAllUsers();
    } catch (err) {
      logger.error(err);
      throw new Error("Error en capa de servicio");
    }
  }

  async getUserByEmail(email) {
    try {
      return await userManager.getUsersByEmail(email);
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  async getUserByCartId(cartId) {
    try {
      return await userManager.getUserByCartId(cartId);
    } catch (err) {
      logger.error("Error en capa de servicio", err);
      throw new Error(err);
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

  async updateRolByAdmin(id, rol) {
    try {
      return await userManager.updateRolByAdmin(id, rol);
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

  async deleteInactiveUsers() {
    try {
      return await userManager.deleteUsers();
    } catch (err) {
      logger.error("Error en capa de servicio", err);
      throw new Error(`Error en capa de servicio: ${err.message}`);
    }
  }

  async adminDelete(id) {
    try {
      return await userManager.adminDelete(id);
    } catch (err) {
      logger.error("Error en capa de servicio", err.message);
      throw new Error(err);
    }
  }
}
