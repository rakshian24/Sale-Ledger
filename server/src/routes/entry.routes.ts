import { Router } from "express";
import {
  createEntry,
  deleteEntry,
  downloadMonthlyEntriesPdf,
  getEntries,
  getEntryById,
  getMonthlySummary,
  updateEntry,
} from "../controllers/entry.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getEntries);
router.post("/", createEntry);
router.get("/summary/monthly", getMonthlySummary);
router.get("/report/pdf", downloadMonthlyEntriesPdf);
router.get("/:id", getEntryById);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

export default router;
