import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const adminEmail = "admin@helpdesk.local";
const adminPassword = "Admin@123";

const techSeeds = [
  {
    name: "Tech One",
    email: "tech1@helpdesk.local",
    password: "Tech1@123",
    availability: [
      { start: 8, end: 12 },
      { start: 14, end: 18 }
    ]
  },
  {
    name: "Tech Two",
    email: "tech2@helpdesk.local",
    password: "Tech2@123",
    availability: [
      { start: 10, end: 14 },
      { start: 16, end: 20 }
    ]
  },
  {
    name: "Tech Three",
    email: "tech3@helpdesk.local",
    password: "Tech3@123",
    availability: [
      { start: 12, end: 16 },
      { start: 18, end: 22 }
    ]
  }
];

const serviceSeeds = [
  {
    name: "Instalacao de software",
    description: "Setup e configuracao inicial",
    priceCents: 12000
  },
  {
    name: "Manutencao preventiva",
    description: "Revisao e limpeza",
    priceCents: 18000
  },
  {
    name: "Suporte remoto",
    description: "Atendimento online",
    priceCents: 9000
  },
  {
    name: "Troca de componente",
    description: "Substituicao de hardware",
    priceCents: 25000
  },
  {
    name: "Diagnostico tecnico",
    description: "Analise de problema",
    priceCents: 15000
  }
];

const buildTimes = (start: number, end: number) => {
  const times: string[] = [];
  for (let hour = start; hour <= end; hour += 1) {
    const formatted = String(hour).padStart(2, "0");
    times.push(`${formatted}:00`);
  }
  return times;
};

const buildAvailability = (ranges: { start: number; end: number }[]) =>
  ranges.flatMap((range) => buildTimes(range.start, range.end));

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminExists) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
        mustChangePassword: false
      }
    });
  }

  const techExists = await prisma.user.findFirst({
    where: { role: Role.TECH }
  });

  if (!techExists) {
    for (const tech of techSeeds) {
      const passwordHash = await bcrypt.hash(tech.password, 10);
      await prisma.user.create({
        data: {
          name: tech.name,
          email: tech.email,
          passwordHash,
          role: Role.TECH,
          mustChangePassword: true,
          technicianProfile: {
            create: {
              availabilityTimes: buildAvailability(tech.availability)
            }
          }
        }
      });
    }
  }

  const serviceCount = await prisma.service.count();
  if (serviceCount < serviceSeeds.length) {
    await prisma.service.createMany({
      data: serviceSeeds,
      skipDuplicates: true
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed completed.");
  // eslint-disable-next-line no-console
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  // eslint-disable-next-line no-console
  console.log("Tech logins: tech1@helpdesk.local / Tech1@123 | tech2@helpdesk.local / Tech2@123 | tech3@helpdesk.local / Tech3@123");
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
