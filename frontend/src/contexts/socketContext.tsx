import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { io, Socket } from "socket.io-client";


export interface socketType {
    socket: Socket | null;
}
export const SocketContext = createContext<Socket | null>(null);


/** 
 * @returns socket context
 * @description this useSocket hook returns a SocketContext
 * @argument none
 * @example const newSocket = useSocket(); 
 */
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (!BACKEND_URL) {
            console.log("Backend URL not provided");
            return;
        }

        const newSocket = io(BACKEND_URL, {
            transports: ['websocket']
        });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Socket connected successfully");
        });

        newSocket.on("connect_error", (error) => {
            console.log("Socket connection error:", error);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [BACKEND_URL]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;