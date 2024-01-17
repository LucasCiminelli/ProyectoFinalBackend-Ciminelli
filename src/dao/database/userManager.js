import { userModel } from "../models/user.model.js";

export default class userManager {
  async getAllUsers() {
    try {
      const users = await userModel.find({});
      return users;
    } catch (err) {
      console.error("Error al obtener los usuarios de la base de datos", err);
    }
  }

  async getUsersByEmail(email) {
    try {
      const user = await userModel.findOne({ email }).lean();
      if (!user) {
        console.error("Error, usuario no encontrado");
        return;
      }
      return user;
    } catch (error) {
      console.error(error);
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

  async getUserByCartId(cartId) {
    try {
      const users = await this.getAllUsers({});

      console.log(users);

      for (const user of users) {
        if (user.cart && user.cart._id.toString() === cartId) {
          return user;
        }
      }

      console.error("No se pudo encontrar al usuario asociado al carrito");
      return null;
    } catch (err) {
      console.error("Error al obtener el usuario buscado por cartId", err);
    }
  }

  async updateLastConnection(id, lastConnection) {
    try {
      return userModel.findByIdAndUpdate(id, { $set: lastConnection });
    } catch (err) {
      console.error("Error al actualizar la ultima conexión", err);
    }
  }

  async updateRolByAdmin(id, rol) {
    try {
      return userModel.findByIdAndUpdate(id, { rol });
    } catch (err) {
      console.error("Error al actualizar el rol del usuario seleccionado", err);
    }
  }

  async deleteUsers() {
    try {
      const currentTime = new Date();
      const twoDaysAgo = new Date();

      twoDaysAgo.setDate(currentTime.getDate() - 2);

      const inactiveUsers = await userModel.find({
        last_connection: { $lt: twoDaysAgo },
      });

      const deletedUsers = await Promise.all(
        inactiveUsers.map(async (user) => {
          const deletedUser = await userModel.findByIdAndDelete(user._id);
          return deletedUser;
        })
      );
      return deletedUsers;
    } catch (err) {
      console.error("error al eliminar los usuarios");
      throw err;
    }
  }

  async adminDelete(id) {
    try {
      const user = await userModel.findByIdAndDelete({ _id: id });
      if (!user) {
        console.error("usuario no encontrado en la database");
      }
      return user;
    } catch (err) {
      console.error("Error al eliminar un usuario como administrador");
    }
  }
}
