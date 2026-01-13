import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { meRoutes } from "./me.routes";
import { adminRoutes } from "./admin";
import { techRoutes } from "./tech";
import { clientRoutes } from "./client";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/me", meRoutes);
routes.use("/admin", adminRoutes);
routes.use("/tech", techRoutes);
routes.use("/client", clientRoutes);

export { routes };
