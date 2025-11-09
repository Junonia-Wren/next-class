import userDaos from "../daos/user.daos.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authControllers = {};

const SECRET = process.env.JWT_SECRET; // puedes mover esto a .env

// Registro libre de usuario (alumno)
authControllers.register = (req, res) => {
    const data = req.body;
    data.role = "alumno"; // fuerza el rol por seguridad

    userDaos.create(data)
        .then((newUser) => {
            res.status(201).json({
                message: "Usuario registrado correctamente",
                data: newUser
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "Error al registrar usuario",
                error: error
            });
        });
};

// Login de usuario
authControllers.login = (req, res) => {
    const { matricula, password } = req.body;

    userDaos.getByMatricula(matricula)
        .then(async (user) => {
            if (!user) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }

            const match = await user.comparePassword(password);
            if (!match) {
                return res.status(401).json({
                    message: "Contraseña incorrecta"
                });
            }

            const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "1d" });

            res.json({
                message: "Login exitoso",
                token: token,
                role: user.role
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error al iniciar sesión",
                error: error
            });
        });
};

export default authControllers;