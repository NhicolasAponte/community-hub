import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/email-service";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, name } = validation.data;

    const result = await addSubscriber(email, name);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
        },
        { status: 201 }
      );
    } else {
      // Check if it's a duplicate email error
      if (
        result.error?.includes("unique") ||
        result.error?.includes("duplicate")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Email address is already subscribed",
          },
          { status: 409 }
        );
      }

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
    console.error("Error in subscribe endpoint:", error);
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
