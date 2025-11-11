import "../database.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";



const createAdmin = async () => {
    try {
     

        const existing = await User.findOne({ matricula: "ADMIN001" });
        if (existing) {
            console.log("Ya existe un admin con esa matrícula");
            return;
        }

        const admin = new User({
            matricula: "ADMIN001",
            name: "Administrador",
            password: "admin123",
            role: "admin",
            grupo: "N/A",
            carrera: "ADMIN",
            grado: "ADMIN"
        });

        await admin.save();
        console.log("Admin creado exitosamente");
        mongoose.disconnect();
    } catch (error) {
        console.error("Error al crear admin:", error);
    }
};

createAdmin();