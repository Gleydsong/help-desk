import request from "supertest";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Permissions", () => {
  it("blocks client from admin routes", async () => {
    const passwordHash = await bcrypt.hash("Client@123", 10);

    await prisma.user.create({
      data: {
        name: "Client",
        email: "client@test.com",
        passwordHash,
        role: Role.CLIENT
      }
    });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "client@test.com", password: "Client@123" });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/admin/services")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});
