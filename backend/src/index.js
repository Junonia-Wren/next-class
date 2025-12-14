import http from "http";
import app from "./app.js";
import { initSocket } from "./socket.js";

const server = http.createServer(app);

// Inicializamos sockets
export const io = initSocket(server);

server.listen(app.get("port"), () => {
  console.log("Server listening on port", app.get("port"));
});
