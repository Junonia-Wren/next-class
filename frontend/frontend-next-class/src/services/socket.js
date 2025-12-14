import { io } from "socket.io-client";

let socket = null;

/**
 * Conecta el socket usando JWT
 */
export const connectSocket = () => {
  if (socket) return socket; // 🔒 ya existe
  const token = sessionStorage.getItem("authToken");
  if (!token) return null;

  socket = io("http://localhost:3000", {
    auth: {
      token: token, // 👈 se envía al handshake
    },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("🟢 Socket conectado:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket desconectado");
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Error socket:", err.message);
  });

  return socket;
};

/**
 * Devuelve el socket activo
 */
export const getSocket = () => socket;

/**
 * Cierra la conexión
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
