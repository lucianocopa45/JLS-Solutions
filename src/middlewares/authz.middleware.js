import jwt from "jsonwebtoken";

export const authorizeRole = (rolesPermitidos = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Formato de token inválido" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      console.log("Rol recibido en token:", decoded.role);
      console.log("Roles permitidos:", rolesPermitidos);

      console.log("Rol detectado:", decoded.role);

      if (!rolesPermitidos.includes(decoded.role)) {
        return res.status(403).json({ message: "Acceso denegado: rol no autorizado" });
      }

      next();
    } catch (error) {
      console.error("🛑 Error en autorización:", error.message);
      return res.status(403).json({ message: "Token inválido o expirado" });
    }
  };
};
