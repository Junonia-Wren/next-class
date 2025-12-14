import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js"; // Importamos User para validaciones extra si se requieren

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    // Aceptamos "Bearer token" o solo "token"
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    
    if (!token) return res.status(403).json({ message: "Token requerido" });

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // { uid: '...', role: '...', matricula: '...' }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado: solo admins" });
    }
    next();
};

export const isJefeGrupo = (req, res, next) => {
    // CORRECCIÓN AQUÍ:
    // El rol en la BD es "chief", no "group_leader".
    // Además permitimos pasar si es "admin".
    if (req.user.role === "chief" || req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Acceso denegado: solo jefes de grupo" });
    }
};