import "dotenv/config";
import { prisma } from "../src/lib/prisma";

beforeEach(async () => {
  await prisma.ticketService.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.technicianProfile.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
