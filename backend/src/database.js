import { PrismaClient } from '@prisma/client';

// Initialize the Prisma Client
const prisma = new PrismaClient();

console.log('[Database] 💾 Prisma client initialized.');

// Use a NAMED export. This is the main fix.
export { prisma };

