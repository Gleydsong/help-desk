import request from "supertest";
import bcrypt from "bcryptjs";
import { Role, TicketStatus } from "@prisma/client";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Tickets", () => {
  it("creates ticket and enforces status flow", async () => {
    const clientPassword = "Client@123";
    const techPassword = "Tech@123";

    await prisma.user.create({
      data: {
        name: "Client",
        email: "client@test.com",
        passwordHash: await bcrypt.hash(clientPassword, 10),
        role: Role.CLIENT
      }
    });

    const tech = await prisma.user.create({
      data: {
        name: "Tech",
        email: "tech@test.com",
        passwordHash: await bcrypt.hash(techPassword, 10),
        role: Role.TECH,
        mustChangePassword: false,
        technicianProfile: {
          create: { availabilityTimes: ["08:00", "09:00"] }
        }
      }
    });

    const service = await prisma.service.create({
      data: {
        name: "Service",
        description: "Test",
        priceCents: 10000
      }
    });

    const clientToken = (
      await request(app)
        .post("/api/auth/login")
        .send({ email: "client@test.com", password: clientPassword })
    ).body.token;

    const techToken = (
      await request(app)
        .post("/api/auth/login")
        .send({ email: "tech@test.com", password: techPassword })
    ).body.token;

    const createResponse = await request(app)
      .post("/api/client/tickets")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        title: "Rede lenta",
        description: "A internet esta instavel",
        technicianId: tech.id,
        serviceIds: [service.id]
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.status).toBe(TicketStatus.ABERTO);

    const startResponse = await request(app)
      .patch(`/api/tech/tickets/${createResponse.body.id}/status`)
      .set("Authorization", `Bearer ${techToken}`)
      .send({ status: TicketStatus.EM_ATENDIMENTO });

    expect(startResponse.status).toBe(200);
    expect(startResponse.body.status).toBe(TicketStatus.EM_ATENDIMENTO);

    const closeResponse = await request(app)
      .patch(`/api/tech/tickets/${createResponse.body.id}/status`)
      .set("Authorization", `Bearer ${techToken}`)
      .send({ status: TicketStatus.ENCERRADO });

    expect(closeResponse.status).toBe(200);
    expect(closeResponse.body.status).toBe(TicketStatus.ENCERRADO);
  });
});
