import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async";
import { ApiResponse } from "../utils/apiResponse";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.listForUser(req.user!.id);
  const unreadCount = await notificationService.unreadCount(req.user!.id);
  return ApiResponse.success(res, "Notifications fetched", { notifications, unreadCount });
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationService.markRead(req.params.id as string, req.user!.id);
  return ApiResponse.success(res, "Notification marked read", notification);
});

export const markAllNotificationsRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllRead(req.user!.id);
  return ApiResponse.success(res, "All notifications marked read");
});
