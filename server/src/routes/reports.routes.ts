import { Router } from "express";
import { z } from "zod";
import { coursesByStatus, recentActivity } from "../services/reports.service.ts";
import { activeOffers, quickSummary } from "../services/reports.service.ts";
import { activeOffers, quickSummary, calendarOffers } from "../services/reports.service.ts";


const router = Router();

router.get("/courses-by-status", (_req, res) => {
  res.json(coursesByStatus());
});

router.get("/recent-activity", (req, res) => {
  const QuerySchema = z.object({
    days: z
      .string()
      .transform((v) => Number(v))
      .pipe(z.number().int().positive().max(365))
      .optional()
      .default("30" as unknown as any),
  });

  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Query inválida", details: parsed.error.format() });
  }

  const days = (parsed.data.days as unknown as number) || 30;
  res.json(recentActivity(days));
});

// GET /reports/active-offers?on=AAAA-MM-DD
router.get("/active-offers", (req, res) => {
  const on = typeof req.query.on === "string" ? req.query.on : undefined;
  const result = activeOffers(on);
  if ((result as any).error) return res.status(400).json(result);
  res.json(result);
});

// GET /reports/summary
router.get("/summary", (_req, res) => {
  res.json(quickSummary());
});

// GET /reports/calendar?month=AAAA-MM
router.get("/calendar", (req, res) => {
  const month = typeof req.query.month === "string" ? req.query.month : undefined;
  const result = calendarOffers(month);
  if ((result as any).error) return res.status(400).json(result);
  res.json(result);
});



export default router;
