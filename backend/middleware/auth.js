import jwt from "jsonwebtoken";

export const verificarUsuario = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.user = decoded; // 🔥 acá tenemos el usuario

    next();
  } catch (error) {
    return res.status(401).json({ error: "No autorizado" });
  }
};