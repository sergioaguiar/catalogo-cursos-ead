import { Router } from "express";
import { createOffer, listOffers } from "../services/offers.service.ts";

const router = Router();

// GET /offers
router.get("/", (_req, res) => {
  res.json(listOffers());
});

// POST /offers
router.post("/", async (req, res) => {
  try {
    const { course_id, created_at, period_start, period_end } = req.body ?? {};
    if (!course_id || !period_start || !period_end) {
      return res.status(400).json({ error: "course_id, period_start e period_end são obrigatórios" });
    }
    const created = await createOffer({ course_id: Number(course_id), created_at, period_start, period_end });
    res.status(201).json(created);
  } catch (e: any) {
    res.status(400).json({ error: e.message || "Erro" });
  }
});

export default router;
