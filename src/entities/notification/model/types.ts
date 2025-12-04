import type { notifications } from "@/db/schemas/notifications";

export type NotificationType = typeof notifications.$inferSelect.type;

export type Notification = typeof notifications.$inferSelect;
