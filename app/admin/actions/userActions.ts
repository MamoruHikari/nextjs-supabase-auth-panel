"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function blockUsers(userIds: string[], currentUserId?: string) {
  const { error: userUpdateError } = await supabaseAdmin
    .from("users")
    .update({ status: "blocked" })
    .in("id", userIds);

  if (userUpdateError) {
    return { error: userUpdateError };
  }

  const shouldSignOut = currentUserId && userIds.includes(currentUserId);
  return { success: true, signOutCurrentUser: shouldSignOut };
}

export async function unblockUsers(userIds: string[]) {
  const { error: userUpdateError } = await supabaseAdmin
    .from("users")
    .update({ status: "active" })
    .in("id", userIds);

  if (userUpdateError) {
    return { error: userUpdateError };
  }

  return { success: true };
}

export async function deleteUsers(userIds: string[], currentUserId?: string) {
  const { error: dbError } = await supabaseAdmin
    .from("users")
    .delete()
    .in("id", userIds);

  if (dbError) {
    return { error: dbError };
  }

  for (const id of userIds) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) {
      return { error };
    }
  }

  const shouldSignOut = currentUserId && userIds.includes(currentUserId);
  return { success: true, signOutCurrentUser: shouldSignOut };
}
