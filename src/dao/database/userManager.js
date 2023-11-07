import { userModel } from "../models/user.model.js";

export default class userManager {
  async getUsersByEmail(email) {
    try {
      const user = await userModel.findOne({ email }).lean();
      if (!user) {
        console.error("Error, usuario no encontrado");
        return;
      }
      return user;
    } catch (error) {
      throw new Error("Error en capa de servicio", error);
    }
  }
}
