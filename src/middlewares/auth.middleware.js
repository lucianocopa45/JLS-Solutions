import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    
    // 1. Obtener el encabezado de autorización
    const authHeader = req.headers["authorization"];

    // 2. Verificar si el encabezado existe
    if (!authHeader) {
        // 401 Unauthorized: El token no fue proporcionado
        return res.status(401).json({ 
            message: "Acceso denegado: Token no proporcionado",
            code: "NO_TOKEN" 
        });
    }

    const parts = authHeader.split(" ");
    
    // 3. Verificar el formato 'Bearer <token>'
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        // 401 Unauthorized: Formato incorrecto
        return res.status(401).json({ 
            message: "Acceso denegado: Formato de token inválido. Debe ser 'Bearer <token>'",
            code: "INVALID_FORMAT" 
        });
    }
    
    const token = parts[1];

    // 4. Verificar el Token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        
        if (err) {
            // 401 Unauthorized: Token inválido (expirado, firma incorrecta, etc.)
            // Aunque algunos usan 403 aquí, 401 es más preciso para un fallo de autenticación del token.
            console.error("🛑 Error de verificación JWT:", err.message);
            return res.status(401).json({ 
                message: "Acceso denegado: Token inválido o expirado",
                code: "TOKEN_INVALID" 
            });
        }
        
        // Opcional: Adjuntar la carga útil del token (payload) a la solicitud
        req.user = decoded; 
        
        // 5. Si es válido, continuar
        next();
    });
};