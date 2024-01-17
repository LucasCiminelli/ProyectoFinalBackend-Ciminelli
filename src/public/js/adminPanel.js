console.log("hola");

const eliminarUsuario = async (userId) => {
  try {
    const response = await fetch(`/api/adminDelete/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar un usuario");
    }

    console.log(
      `Usuario con id ${userId} eliminado correctamente de la base de datos`
    );

    location.reload();
  } catch (err) {
    console.error(err);
  }
};

const deleteUserButtons = document.querySelectorAll(".deleteUser");

deleteUserButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const userId = button.getAttribute("data-user-id");
    await eliminarUsuario(userId);
    console.log("Usuario eliminado correctamente");
  });
});

const actualizarUsuario = async (userId, rol) => {
  try {
    const response = await fetch(`/api/updateUserRol/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, rol }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar un usuario");
    }

    console.log(
      `Usuario con id ${userId} actualizado correctamente de la base de datos. Su nuevo rol es ${rol}`
    );

    location.reload();
  } catch (err) {
    console.log("error al actualizar el rol del user: ", err);
  }
};

const updateButtons = document.querySelectorAll(".update-button");

updateButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();

    const userContainer = button.closest(".product-container");

    const userRol = userContainer.querySelector(".rol-dropdown");

    if (userRol !== null) {
      const userId = userRol.getAttribute("data-user-id");
      await actualizarUsuario(userId, userRol.value);
    } else {
      console.error("El elemento userRol es null");
    }
  });
});
