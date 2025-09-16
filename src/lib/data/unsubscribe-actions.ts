"use server";

import { db } from "@/db";
import { subscriberTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function unsubscribeAction(token: string) {
  try {
    // Find subscriber by token
    const subscriber = await db
      .select()
      .from(subscriberTable)
      .where(eq(subscriberTable.unsubscribeToken, token))
      .limit(1);

    if (!subscriber[0]) {
      return {
        success: false,
        message: "Invalid unsubscribe token",
      };
    }

    if (!subscriber[0].subscribed) {
      return {
        success: true,
        message: "You are already unsubscribed",
      };
    }

    // Update subscriber status
    await db
      .update(subscriberTable)
      .set({ subscribed: false })
      .where(eq(subscriberTable.unsubscribeToken, token));

    return {
      success: true,
      message: "Successfully unsubscribed from newsletter",
      email: subscriber[0].email,
    };
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return {
      success: false,
      message: "Failed to process unsubscribe request",
    };
  }
}

export async function resubscribeAction(token: string) {
  try {
    // Find subscriber by token
    const subscriber = await db
      .select()
      .from(subscriberTable)
      .where(eq(subscriberTable.unsubscribeToken, token))
      .limit(1);

    if (!subscriber[0]) {
      return {
        success: false,
        message: "Invalid token",
      };
    }

    // Update subscriber status
    await db
      .update(subscriberTable)
      .set({ subscribed: true })
      .where(eq(subscriberTable.unsubscribeToken, token));

    return {
      success: true,
      message: "Successfully resubscribed to newsletter",
      email: subscriber[0].email,
    };
  } catch (error) {
    console.error("Resubscribe error:", error);
    return {
      success: false,
      message: "Failed to process resubscribe request",
    };
  }
}
