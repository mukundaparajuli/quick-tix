"use client";

import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(eventId?: number): Socket {
    if (!socket) {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        socket = io(base, { withCredentials: true });
    }
    if (eventId) {
        socket.emit("joinEvent", eventId);
    }
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export default getSocket;
