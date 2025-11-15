import { headers } from "next/headers";

/**
 * Get user ID from proxy headers without making additional auth calls.
 * This avoids duplicate Supabase auth API calls.
 * @returns User ID string or null if not authenticated
 */
export const getUserIdFromMiddleware = async (): Promise<string | null> => {
  const headersList = await headers();
  return headersList.get("x-user-id");
};
