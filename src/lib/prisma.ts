import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/index";

const connectionString = process.env.DATABASE_URL ?? process.env.PRISMA_DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL or PRISMA_DATABASE_URL must be set.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };