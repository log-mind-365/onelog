import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schemas/notifications";

export const getNotification = async (currentUserId: string) => {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.receiverId, currentUserId))
    .then((row) => row[0]);
};
