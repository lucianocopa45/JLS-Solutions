import jwt from 'jsonwebtoken'
import { createLogin } from '../services/user.service.js';

//import ApiError from '../utils/ApiError';
export const login = async (req, res) => {

  try {
    const { username, password } = req.body;

    // 1. Validar campos vacíos
    if (!username || !password) {
      return res.status(400).json({ message: "Faltan credenciales" });
    }

    // 2. Llamar a la función de autenticación (que ahora compara contraseñas)
    const user = await createLogin({ username, password });

    if (!user) {
      // 3. Error 401: Autenticación fallida
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // 4. 🔑 Generar token con datos del usuario
    const token = jwt.sign(
      {
        username: user.username,
        role: user.role_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Token Generado", token);
    
    console.log("✅ Usuario logueado:", user.username);

    // 5. Respuesta exitosa (200)
    return res.status(200).json({
      success: true,
      token,
      role: user.role_name,
    });

  } catch (error) {
    // 6. Manejo de error interno
    console.error("🛑 Error capturado:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
}