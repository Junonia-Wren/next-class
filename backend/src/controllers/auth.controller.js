import userDaos from "../daos/user.daos.js";
import Group from "../models/group.model.js"; 
import Activity from "../models/activity.model.js"; // <--- 1. IMPORTAR MODELO ACTIVIDAD
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;
const authControllers = {};

// Registro (solo alumnos)
authControllers.register = async (req, res) => {
    try {
        const { matricula, name, password, nivel, area, grupo } = req.body;

        const userData = {
            matricula,
            name,
            password,
            role: "student"
        };

        // 1. CREAR USUARIO
        const newUser = await userDaos.create(userData);

        // 2. ASIGNACIÓN AUTOMÁTICA DE GRUPO
        if (nivel && area && grupo) {
            
            const groupFound = await Group.findOne({ 
                level: nivel, 
                area: area, 
                name: grupo 
            });

            if (groupFound) {
                // A) EL GRUPO EXISTE: Agregamos al alumno
                groupFound.students.push(newUser._id);
                await groupFound.save();
            } else {
                // B) EL GRUPO NO EXISTE: Lo creamos
                await Group.create({
                    level: nivel,
                    area: area,
                    name: grupo,
                    students: [newUser._id]
                });
                console.log(`Grupo nuevo ${grupo} creado automáticamente.`);
            }

            // 3. REGISTRAR ACTIVIDAD (NUEVO)
            // Formato: "Se ha registrado [Nombre] en [Área] [Grupo]"
            await Activity.create({
                type: 'REGISTRO',
                message: `Se ha registrado ${name} en ${area} ${grupo}`
            });
        }

        return res.status(201).json({
            message: "Usuario registrado y asignado correctamente",
            data: newUser
        });

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(400).json({
            message: "Error al registrar usuario",
            error: error.message || error
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

        const token = jwt.sign(
            {
                uid: user._id,
                matricula: user.matricula,
                role: user.role,
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