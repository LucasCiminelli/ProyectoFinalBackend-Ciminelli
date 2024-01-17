const isAdmin = (req, res, next) => {
  if (req.session.rol !== "Admin") {
    res.status(401).send("Autorización denegada");
    return;
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.session.rol !== "User") {
    res.status(401).send("Autorización denegada");
    return;
  }
  next();
};

export { isAdmin, isUser };
