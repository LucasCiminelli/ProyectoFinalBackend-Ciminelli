import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import bcrypt from "bcrypt";

const router = Router();



router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = userModel.findOne({ email });

  if (!user) {
    return res.status(401).send("Tu cuenta no existe");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).send("Contraseña equivocada");
  }


  

});

export default router;
