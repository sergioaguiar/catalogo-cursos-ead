import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Arquivo do banco (JSON) ao lado deste .ts
export const DB_PATH = path.join(__dirname, "db.json");

// Tipos do schema
export type Course = {
  id: number;
  title: string;
  status: "ativo" | "inativo";
  created_at: string;
};

export type Offer = {
  id: number;
  course_id: number;
  created_at: string;
  period_start: string;
  period_end: string;
};

export type DbSchema = {
  courses: Course[];
  offers: Offer[];
};

// Adapter + DB com dados padrão (obrigatório no lowdb v6)
const adapter = new JSONFile<DbSchema>(DB_PATH);
export const db = new Low<DbSchema>(adapter, { courses: [], offers: [] });

export async function initDb() {
  // Garante que o arquivo exista
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ courses: [], offers: [] }, null, 2), { encoding: "utf8" });
  }

  await db.read();

  // Se por algum motivo vier null, reescreve com defaults
  if (!db.data) {
    db.data = { courses: [], offers: [] };
    await db.write();
  }

  console.log(`🗂️  DB em: ${DB_PATH} | cursos=${db.data.courses.length}`);
}
