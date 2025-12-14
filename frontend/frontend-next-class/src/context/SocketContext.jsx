import React, { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) return;

    const s = connectSocket();
    setSocket(s);

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [sessionStorage.getItem("authToken")]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
