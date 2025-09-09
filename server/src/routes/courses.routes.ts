import { Router } from "express";
import { createCourse, getCourseById, listCourses } from "../services/courses.service.ts";

const router = Router();

// GET /courses
router.get("/", (_req, res) => {
  res.json(listCourses());
});

// GET /courses/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = getCourseById(id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// POST /courses
router.post("/", async (req, res) => {
  try {
    const { title, status, created_at } = req.body ?? {};
    if (!title || !status) return res.status(400).json({ error: "title e status são obrigatórios" });
    const created = await createCourse({ title, status, created_at });
    res.status(201).json(created);
  } catch (e: any) {
    res.status(400).json({ error: e.message || "Erro" });
  }
});

export default router;
