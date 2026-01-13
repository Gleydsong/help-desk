import request from "supertest";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Auth", () => {
  it("rejects invalid login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid@test.com", password: "123456" });

    expect(response.status).toBe(401);
  });

  it("returns token for valid login", async () => {
    const passwordHash = await bcrypt.hash("Pass@123", 10);

    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@test.com",
        passwordHash,
        role: Role.ADMIN
      }
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "Pass@123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });
});
