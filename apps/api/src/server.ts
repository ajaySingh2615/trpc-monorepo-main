import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { logger } from "@repo/logger";
import { serverRouter, createContext } from "@repo/trpc/server";
import { env } from "./env";

export const app = express();

// middleware
if (env.NODE_ENV !== "prod") {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );
}

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.json({ message: "API is up and running" });
});

app.get("/health", (req, res) => {
  logger.info("health check hit");
  res.json({ message: "server is healthy", healthy: true });
});

// trpc
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
