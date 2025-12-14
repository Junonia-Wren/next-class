import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// MODELS
import { User, Group, Subject, Schedule, Task } from "../models/index.models.js";

console.log("Iniciando seed...");

// ========================
//      SEED GLOBAL
// ========================

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(">> Conectado a MongoDB para SEED");

    // 🧨 LIMPIAR TODO
    await Promise.all([
      User.deleteMany({}),
      Group.deleteMany({}),
      Subject.deleteMany({}),
      Schedule.deleteMany({}),
      Task.deleteMany({})
    ]);
    console.log(">> Colecciones limpiadas");

    // ========================
    //   1️⃣ ADMIN DEFAULT
    // ========================
    const admin = await User.create({
      matricula: "ADMIN001",
      name: "Administrador General",
      password: "admin123",
      role: "admin",
      group: null
    });
    console.log(">> Admin creado");

    // ========================
    //   2️⃣ GRUPOS
    // ========================
    const grupos = await Group.insertMany([
      { name: "5A", area: "DSM", level: "Technical" },
      { name: "5B", area: "DSM", level: "Technical" },
      { name: "6A", area: "EVND", level: "Engineering" }
    ]);
    console.log(">> Grupos creados:", grupos.length);

    // Index rápido por nombre
    const G = {
      "5A": grupos.find(g => g.name === "5A"),
      "5B": grupos.find(g => g.name === "5B"),
      "6A": grupos.find(g => g.name === "6A")
    };


    // ========================
    //   4️⃣ PROFESORES
    // ========================
    const profesores = await User.insertMany([
      {
        matricula: "PROF001",
        name: "Carlos Web",
        password: "prof123",
        role: "teacher",
        group: null
      },
      {
        matricula: "PROF002",
        name: "Laura BD",
        password: "prof123",
        role: "teacher",
        group: null
      }
    ]);

    const P = {
      WEB: profesores[0],
      BD: profesores[1]
    };

    console.log(">> Profesores creados:", profesores.length);

    // ========================
    //   5️⃣ JEFES DE GRUPO
    // ========================
    const jefes = await User.insertMany([
      {
        matricula: "JEFE5A",
        name: "Lider 5A",
        password: "jefe123",
        role: "group_leader",
        group: G["5A"]._id
      },
      {
        matricula: "JEFE6A",
        name: "Lider 6A",
        password: "jefe123",
        role: "group_leader",
        group: G["6A"]._id
      }
    ]);
    console.log(">> Jefes creados:", jefes.length);

    // ========================
    //   6️⃣ ALUMNOS
    // ========================
    const alumnos = await User.insertMany([
      {
        matricula: "ALU001",
        name: "Alumno Uno",
        password: "alumno123",
        role: "student",
        group: G["5A"]._id
      },
      {
        matricula: "ALU002",
        name: "Alumno Dos",
        password: "alumno123",
        role: "student",
        group: G["6A"]._id
      }
    ]);
    console.log(">> Alumnos creados:", alumnos.length);

    console.log("\n🌱 SEED COMPLETADO CORRECTAMENTE 🌱");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
};

seedAll();
