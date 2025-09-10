import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import { initDb } from "./db/connection.ts";
import coursesRoutes from "./routes/courses.routes.ts";
import offersRoutes from "./routes/offers.routes.ts";
import reportsRoutes from "./routes/reports.routes.ts";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares globais
app.use(cors());               // libera CORS
app.use(helmet());             // segurança nos headers
app.use(morgan("dev"));        // logs de requisições
app.use(express.json());

// 🔑 força JSON sempre em UTF-8
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// rotas
app.use("/courses", coursesRoutes);
app.use("/offers", offersRoutes);
app.use("/reports", reportsRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => res.json({ message: "API do Catálogo EAD rodando 🚀" }));


await initDb();
console.log(`✅ API rodando em http://localhost:${PORT}`);

app.listen(PORT);

// --- handler de erro simples (último middleware) ---
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = Number(err?.status) || 500;
  const message = err?.message || "Erro interno";
  const details = err?.details;
  res.status(status).json({ error: message, status, details });
});

