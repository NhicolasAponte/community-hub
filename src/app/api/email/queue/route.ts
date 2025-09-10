import { NextResponse } from "next/server";
import {
  startEmailQueue,
  stopEmailQueue,
  getEmailQueueProcessor,
} from "@/lib/email-queue-processor";

export async function POST() {
  try {
    const processor = getEmailQueueProcessor();

    if (processor.isRunning()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email queue is already running",
        },
        { status: 400 }
      );
    }

    startEmailQueue();

    return NextResponse.json(
      {
        success: true,
        message: "Email queue processor started successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error starting email queue:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to start email queue",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    stopEmailQueue();

    return NextResponse.json(
      {
        success: true,
        message: "Email queue processor stopped",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error stopping email queue:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to stop email queue",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const processor = getEmailQueueProcessor();

    return NextResponse.json(
      {
        success: true,
        isRunning: processor.isRunning(),
        message: processor.isRunning()
          ? "Email queue is running"
          : "Email queue is stopped",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking email queue status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check queue status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
