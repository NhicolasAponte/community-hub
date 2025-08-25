import { NextRequest, NextResponse } from "next/server";
import { unsubscribeUser } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsubscribe token is required",
        },
        { status: 400 }
      );
    }

    const result = await unsubscribeUser(token);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
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
    console.error("Error in unsubscribe endpoint:", error);
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

// Also handle GET requests for direct unsubscribe links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head><title>Unsubscribe Error</title></head>
          <body>
            <h1>Error</h1>
            <p>Invalid unsubscribe link. Please contact support if you continue to have issues.</p>
          </body>
        </html>
      `,
        {
          headers: { "Content-Type": "text/html" },
          status: 400,
        }
      );
    }

    const result = await unsubscribeUser(token);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${result.success ? "Unsubscribed" : "Error"}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { color: #28a745; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1 class="${result.success ? "success" : "error"}">
            ${result.success ? "Successfully Unsubscribed" : "Error"}
          </h1>
          <p>${result.message}</p>
          ${result.success ? "<p>You will no longer receive newsletter emails from us.</p>" : ""}
        </body>
      </html>
    `;

    return new Response(html, {
      headers: { "Content-Type": "text/html" },
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Error in unsubscribe GET endpoint:", error);
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head><title>Unsubscribe Error</title></head>
        <body>
          <h1>Error</h1>
          <p>An error occurred while processing your unsubscribe request.</p>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
        status: 500,
      }
    );
  }
}
