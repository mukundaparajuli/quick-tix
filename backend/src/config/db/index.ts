import { PrismaClient } from "@prisma/client";
import { env } from "../env.config";

declare global {
    var prisma: PrismaClient | undefined;
}

const db = globalThis.prisma || new PrismaClient();

if (env.NODE_ENV !== 'production') globalThis.prisma = db;

export default db;