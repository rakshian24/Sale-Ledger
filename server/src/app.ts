import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import entryRoutes from "./routes/entry.routes.js";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware.js";

const app = express();

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(helmet());

app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Sale Ledger API"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
