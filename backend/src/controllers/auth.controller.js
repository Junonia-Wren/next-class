import userDaos from "../daos/user.daos.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;
const authControllers = {};

// Registro (solo alumnos)
authControllers.register = async (req, res) => {
    try {
        const data = req.body;

        // Forzar rol seguro
        data.role = "student";

        const newUser = await userDaos.create(data);

        return res.status(201).json({
            message: "Usuario registrado correctamente",
            data: newUser
        });

    } catch (error) {
        return res.status(400).json({
            message: "Error al registrar usuario",
            error
        });
    }
};

// Login
authControllers.login = async (req, res) => {
    try {
        const { matricula, password } = req.body;

        const user = await userDaos.getByMatricula(matricula);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Token limpio con IDs correctos
        const token = jwt.sign(
            {
                uid: user._id,
                matricula: user.matricula,
                role: user.role,
                group: user.group ? user.group.toString() : null,
            },
            SECRET,
            { expiresIn: "1d" }
        );


        return res.json({
            message: "Login exitoso",
            token,
            role: user.role
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message
        });
    }
};

export default authControllers;
