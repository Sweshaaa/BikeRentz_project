import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { requestLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/error";
import { ErrorResponse } from "./utils/errorResponse";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import bikeRoutes from "./routes/bike.route";
import rentalRoutes from "./routes/rental.route";
import notificationRoutes from "./routes/notification.route";

import adminBikeRoutes from "./routes/admin/bike.route";
import adminUserRoutes from "./routes/admin/user.route";
import adminRentalRoutes from "./routes/admin/rental.route";
import adminDashboardRoutes from "./routes/admin/dashboard.route";

const app: Application = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "bikerentz-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/admin/bikes", adminBikeRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/rentals", adminRentalRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

app.use((req, _res, next) => {
  next(new ErrorResponse(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

export default app;
