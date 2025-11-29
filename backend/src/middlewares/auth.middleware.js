import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token requerido" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // aquí guardamos los datos del usuario en req.user
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado: solo admins" });
    }
    next();
};

export const isJefeGrupo = (req, res, next) => {
    if (req.user.role !== "jefe_grupo") {
        return res.status(403).json({ message: "Acceso denegado: solo jefes de grupo" });
    }
    next();
};