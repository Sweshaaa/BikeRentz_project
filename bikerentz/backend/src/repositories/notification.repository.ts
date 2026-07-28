import Notification, { INotification } from "../models/Notification";

export class NotificationRepository {
  create(data: Partial<INotification>) {
    return Notification.create(data);
  }

  findByUser(userId: string) {
    return Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  markRead(id: string, userId: string) {
    return Notification.findOneAndUpdate({ _id: id, user: userId }, { read: true }, { new: true });
  }

  markAllRead(userId: string) {
    return Notification.updateMany({ user: userId, read: false }, { read: true });
  }

  countUnread(userId: string) {
    return Notification.countDocuments({ user: userId, read: false });
  }
}
