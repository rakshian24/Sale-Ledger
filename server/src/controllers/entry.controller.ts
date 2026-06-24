import mongoose from "mongoose";
import { Request, Response } from "express";
import { z } from "zod";
import { Entry } from "../models/Entry.model.js";

const entrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  salesCount: z.number().int().nonnegative().default(0),
  cash: z.number().nonnegative().default(0),
  phonePe: z.number().nonnegative().default(0),
  expense: z.number().nonnegative().default(0),
  isHoliday: z.boolean().default(false),
  note: z.string().optional().default(""),
});

const updateEntrySchema = entrySchema.partial().extend({
  date: z.string().min(1, "Date is required").optional(),
});

const getUserId = (req: Request) => {
  if (!req.user?.id) {
    throw new Error("User not available in request");
  }

  return req.user.id;
};

const getMonthRange = (month: number, year: number) => {
  const monthIndex = month - 1;

  const startDate = new Date(Date.UTC(year, monthIndex, 1));
  const endDate = new Date(Date.UTC(year, monthIndex + 1, 1));

  const start = startDate.toISOString().slice(0, 10);
  const end = endDate.toISOString().slice(0, 10);

  return { start, end };
};

export const createEntry = async (req: Request, res: Response) => {
  const data = entrySchema.parse(req.body);
  const userId = getUserId(req);

  const entry = await Entry.create({
    ...data,
    userId,
  });

  res.status(201).json({
    entry,
  });
};

export const getEntries = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const month = req.query.month ? Number(req.query.month) : undefined;
  const year = req.query.year ? Number(req.query.year) : undefined;

  const filter: Record<string, unknown> = {
    userId,
  };

  if (month && year) {
    const { start, end } = getMonthRange(month, year);

    filter.date = {
      $gte: start,
      $lt: end,
    };
  }

  const entries = await Entry.find(filter).sort({ date: 1 });

  res.json({
    entries,
  });
};

export const getEntryById = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const entry = await Entry.findOne({
    _id: req.params.id,
    userId,
  });

  if (!entry) {
    res.status(404).json({
      message: "Entry not found",
    });
    return;
  }

  res.json({
    entry,
  });
};

export const updateEntry = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const data = updateEntrySchema.parse(req.body);

  const entry = await Entry.findOne({
    _id: req.params.id,
    userId,
  });

  if (!entry) {
    res.status(404).json({
      message: "Entry not found",
    });
    return;
  }

  Object.assign(entry, data);

  await entry.save();

  res.json({
    entry,
  });
};

export const deleteEntry = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const entry = await Entry.findOneAndDelete({
    _id: req.params.id,
    userId,
  });

  if (!entry) {
    res.status(404).json({
      message: "Entry not found",
    });
    return;
  }

  res.json({
    message: "Entry deleted successfully",
  });
};

export const getMonthlySummary = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const month = Number(req.query.month);
  const year = Number(req.query.year);

  if (!month || !year) {
    res.status(400).json({
      message: "month and year query params are required",
    });
    return;
  }

  const { start, end } = getMonthRange(month, year);

  const [summary] = await Entry.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: start,
          $lt: end,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$salesCount" },
        totalCash: { $sum: "$cash" },
        totalPhonePe: { $sum: "$phonePe" },
        totalCollection: { $sum: "$total" },
        totalExpense: { $sum: "$expense" },
        totalProfit: { $sum: "$profit" },
      },
    },
  ]);

  res.json({
    month,
    year,
    totalSales: summary?.totalSales ?? 0,
    totalCash: summary?.totalCash ?? 0,
    totalPhonePe: summary?.totalPhonePe ?? 0,
    totalCollection: summary?.totalCollection ?? 0,
    totalExpense: summary?.totalExpense ?? 0,
    totalProfit: summary?.totalProfit ?? 0,
  });
};
