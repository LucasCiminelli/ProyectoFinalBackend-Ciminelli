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

  async getUserById(id) {
    try {
      const user = await userModel.findById({ _id: id });
      if (!user) {
        console.error("Usuario no encontrado");
        return;
      }
      return user;
    } catch (err) {
      console.error(err);
    }
  }

  async updateLastConnection(id, lastConnection) {
    return userModel.findByIdAndUpdate(id, { $set: lastConnection });
  }
}
