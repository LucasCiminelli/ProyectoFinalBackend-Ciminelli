import passport from "passport";


const jwtAuthMiddleware = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        console.error("Error en la autenticación JWT:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }
  
      if (!user) {
        console.warn("Acceso no autorizado. Token no válido.");
        return res.status(401).json({ message: "Acceso no autorizado" });
      }
  
      req.user = user;  // Esto es importante para que el usuario esté disponible en las rutas siguientes
      next();
    })(req, res, next);
  };
  
  export default jwtAuthMiddleware;
  