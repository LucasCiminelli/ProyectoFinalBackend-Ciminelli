const verifyToken = (req, res, next) => {
  const token = req.cookies["coderCookieToken"];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
    // Token válido, continúa
    next();
  });
};

export default verifyToken;
