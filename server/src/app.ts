import express from "express";
import { initDb, DB_PATH, db } from "./db/connection.ts";
import coursesRoutes from "./routes/courses.routes.ts";
import offersRoutes from "./routes/offers.routes.ts";
import reportsRoutes from "./routes/reports.routes.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// rotas
app.use("/courses", coursesRoutes);
app.use("/offers", offersRoutes);
app.use("/reports", reportsRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

await initDb();
console.log(`✅ API rodando em http://localhost:${PORT}`);

app.listen(PORT);
