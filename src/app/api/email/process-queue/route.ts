import { NextResponse } from "next/server";
import { processPendingEmails } from "@/lib/email-service";

export async function POST() {
  try {
    // Optional: Add authentication/authorization here
    // You might want to check for an API key or admin session

    const result = await processPendingEmails();

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: `Processed ${result.processed} emails`,
          data: {
            processed: result.processed,
            successCount: result.successCount,
            failureCount: result.failureCount,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in process-queue endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check queue status
export async function GET() {
  try {
    const { getQueueStats } = await import("@/lib/email-service");
    const result = await getQueueStats();

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          stats: result.stats,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in queue stats endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
