import { Router } from "express";
import { coursesByStatus, recentActivity } from "../services/reports.service.ts";

const router = Router();

router.get("/courses-by-status", (_req, res) => {
  res.json(coursesByStatus());
});

router.get("/recent-activity", (req, res) => {
  const days = Number(req.query.days ?? 30);
  res.json(recentActivity(Number.isFinite(days) ? days : 30));
});

export default router;
