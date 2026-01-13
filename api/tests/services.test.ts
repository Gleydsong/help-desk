import request from "supertest";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Services", () => {
  it("hides deactivated services from clients", async () => {
    const adminPassword = "Admin@123";
    const clientPassword = "Client@123";

    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@test.com",
        passwordHash: await bcrypt.hash(adminPassword, 10),
        role: Role.ADMIN
      }
    });

    await prisma.user.create({
      data: {
        name: "Client",
        email: "client@test.com",
        passwordHash: await bcrypt.hash(clientPassword, 10),
        role: Role.CLIENT
      }
    });

    const service = await prisma.service.create({
      data: {
        name: "Hidden",
        description: "Hidden service",
        priceCents: 1000
      }
    });

    const adminToken = (
      await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@test.com", password: adminPassword })
    ).body.token;

    await request(app)
      .patch(`/api/admin/services/${service.id}/deactivate`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send();

    const clientToken = (
      await request(app)
        .post("/api/auth/login")
        .send({ email: "client@test.com", password: clientPassword })
    ).body.token;

    const listResponse = await request(app)
      .get("/api/client/services")
      .set("Authorization", `Bearer ${clientToken}`);

    expect(listResponse.status).toBe(200);
    const ids = listResponse.body.map((item: { id: string }) => item.id);
    expect(ids).not.toContain(service.id);
  });
});
