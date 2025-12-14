import React, { createContext, useEffect } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    const socket = connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={true}>
      {children}
    </SocketContext.Provider>
  );
};
