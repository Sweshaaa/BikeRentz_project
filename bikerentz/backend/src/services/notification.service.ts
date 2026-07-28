import { NotificationRepository } from "../repositories/notification.repository";

const notificationRepo = new NotificationRepository();

export class NotificationService {
  async notify(userId: string, message: string, type: "booking" | "system" | "payment" | "reminder" = "system") {
    return notificationRepo.create({ user: userId as unknown as never, message, type });
  }

  async listForUser(userId: string) {
    return notificationRepo.findByUser(userId);
  }

  async markRead(id: string, userId: string) {
    return notificationRepo.markRead(id, userId);
  }

  async markAllRead(userId: string) {
    return notificationRepo.markAllRead(userId);
  }

  async unreadCount(userId: string) {
    return notificationRepo.countUnread(userId);
  }
}
