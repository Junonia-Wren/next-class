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
    //   3️⃣ MATERIAS
    // ========================
    const materias = await Subject.insertMany([
      {
        name: "Programación Web",
        porcentajes: {
          ser: {
            valor: 40,
            descripcion: "Tareas, participación, actitud y responsabilidad"
          },
          saber: {
            valor: 10,
            descripcion: "Examen teórico"
          },
          saberHacer: {
            valor: 50,
            descripcion: "Proyecto final integrador"
          }
        },
        unidades: [
          {
            porcentaje: 30,
            fechas: "8 Septiembre al 30 de Octubre"
          },
          {
            porcentaje: 70,
            fechas: "2 Noviembre al 19 de Diciembre"
          }
        ],
        notas: "Se tendrá en cuenta asistencia mínima del 80% para poder ser evaluado.",
        groups: [G["5A"]._id, G["5B"]._id]
      },

      {
        name: "Base de Datos",
        porcentajes: {
          ser: {
            valor: 40,
            descripcion: "Prácticas semanales y participación"
          },
          saber: {
            valor: 20,
            descripcion: "Examen teórico sobre normalización"
          },
          saberHacer: {
            valor: 40,
            descripcion: "Proyecto final de modelado y SQL"
          }
        },
        unidades: [
          {
            porcentaje: 50,
            fechas: "10 Septiembre al 25 Octubre"
          },
          {
            porcentaje: 50,
            fechas: "27 Octubre al 18 Diciembre"
          }
        ],
        notas: "Es obligatorio entregar todas las prácticas para aprobar.",
        groups: [G["5A"]._id]
      },

      {
        name: "Proyecto Integrador",
        porcentajes: {
          ser: {
            valor: 30,
            descripcion: "Compromiso y participación en el equipo"
          },
          saber: {
            valor: 20,
            descripcion: "Fundamentos teóricos del proyecto"
          },
          saberHacer: {
            valor: 50,
            descripcion: "Ejecución del proyecto final"
          }
        },
        unidades: [
          {
            porcentaje: 40,
            fechas: "1 Septiembre al 20 Octubre"
          },
          {
            porcentaje: 60,
            fechas: "21 Octubre al 20 Diciembre"
          }
        ],
        notas: "Se evaluará trabajo colaborativo.",
        groups: [G["6A"]._id]
      }
    ]);

    console.log(">> Materias creadas:", materias.length);

    const M = {
      PW: materias[0],
      BD: materias[1],
      PI: materias[2]
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

    // ========================
    //   7️⃣ HORARIOS POR GRUPO
    // ========================

    const horarios = await Schedule.insertMany([
      {
        group: G["5A"]._id,
        subject: M.PW._id,
        teacher: P.WEB._id,
        day: "Monday",
        startTime: "08:00",
        endTime: "09:00",
        classroom: "Lab 1"
      },
      {
        group: G["5A"]._id,
        subject: M.BD._id,
        teacher: P.BD._id,
        day: "Tuesday",
        startTime: "09:00",
        endTime: "10:00",
        classroom: "Lab 2"
      },
      {
        group: G["6A"]._id,
        subject: M.PI._id,
        teacher: P.WEB._id,
        day: "Monday",
        startTime: "11:00",
        endTime: "12:00",
        classroom: "Sala PI"
      }
    ]);

    console.log(">> Horarios creados:", horarios.length);

    // ========================
    //   8️⃣ TAREAS DEMO
    // ========================

    const tareas = await Task.insertMany([
      {
        title: "Tarea 1 PW",
        description: "Resolver ejercicios HTML",
        dueDate: "2025-12-20",
        subject: M.PW._id,
        group: G["5A"]._id,
        createdBy: jefes[0]._id
      },
      {
        title: "Tarea 1 PI",
        description: "Preparar exposición",
        dueDate: "2025-12-22",
        subject: M.PI._id,
        group: G["6A"]._id,
        createdBy: jefes[1]._id
      }
    ]);

    console.log(">> Tareas demo creadas:", tareas.length);

    console.log("\n🌱 SEED COMPLETADO CORRECTAMENTE 🌱");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
};

seedAll();
