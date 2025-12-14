import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Group from "./models/group.model.js";

dotenv.config();
const SECRET = process.env.JWT_SECRET;

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // AJUSTA esto en producción
      methods: ["GET", "POST"],
    },
  });

  /**
   * 🔐 Middleware de autenticación para sockets
   */
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers["authorization"];

      if (!token) {
        return next(new Error("Token requerido"));
      }

      const cleanToken = token.startsWith("Bearer ")
        ? token.slice(7)
        : token;

      const decoded = jwt.verify(cleanToken, SECRET);

      socket.user = decoded; // { uid, role, matricula }
      next();
    } catch (error) {
      next(new Error("Token inválido"));
    }
  });

  io.on("connection", async (socket) => {
    const { uid, role } = socket.user;

    socket.join(`role:${role}`);
    socket.join(`user:${uid}`);

    // 👇 SOLO ALUMNOS (o jefes si quieres)
    if (role === "student" || role === "chief") {
      const group = await Group.findOne({ students: uid });

      if (group) {
        socket.join(`group:${group.name}`);
        console.log(`🟢 Usuario ${uid} unido a group:${group.name}`);
      }
    }

    if (role === "admin") {
      socket.join("admins");
    }
  });

  return io;
};
