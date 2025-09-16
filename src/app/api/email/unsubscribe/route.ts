import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribe Error - Community Hub</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
              background-color: #f6f9fc;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            .error {
              color: #dc3545;
              font-size: 48px;
              margin-bottom: 20px;
            }
            h1 {
              color: #111827;
              margin-bottom: 10px;
            }
            p {
              color: #6b7280;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">✗</div>
            <h1>Invalid Unsubscribe Link</h1>
            <p>
              The unsubscribe link appears to be invalid or incomplete.
              Please contact support if you continue to have issues.
            </p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">
              Return to Community Hub
            </a>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
        status: 400,
      }
    );
  }

  try {
    const { unsubscribeUser } = await import("@/lib/email-service");
    const result = await unsubscribeUser(token);

    if (result.success) {
      // Return success HTML page
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribed - Community Hub</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
                background-color: #f6f9fc;
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              .success {
                color: #10b981;
                font-size: 48px;
                margin-bottom: 20px;
              }
              h1 {
                color: #111827;
                margin-bottom: 10px;
              }
              p {
                color: #6b7280;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                margin: 0 10px;
              }
              .button:hover {
                background-color: #1d4ed8;
              }
              .button-secondary {
                background-color: #6b7280;
              }
              .button-secondary:hover {
                background-color: #4b5563;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success">✓</div>
              <h1>Successfully Unsubscribed</h1>
              <p>
                You have been unsubscribed from Community Hub newsletters.
                We're sorry to see you go!
              </p>
              <p>
                If you change your mind, you can always subscribe again on our website.
              </p>
              <div>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">
                  Return to Community Hub
                </a>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/newsletter" class="button button-secondary">
                  Resubscribe
                </a>
              </div>
            </div>
          </body>
        </html>
        `,
        {
          headers: {
            "Content-Type": "text/html",
          },
          status: 200,
        }
      );
    } else {
      // Return error HTML page
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribe Error - Community Hub</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
                background-color: #f6f9fc;
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              .error {
                color: #dc3545;
                font-size: 48px;
                margin-bottom: 20px;
              }
              h1 {
                color: #111827;
                margin-bottom: 10px;
              }
              p {
                color: #6b7280;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
              }
              .button:hover {
                background-color: #1d4ed8;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="error">✗</div>
              <h1>Unsubscribe Failed</h1>
              <p>${result.message}</p>
              <p>
                Please contact support if you continue to have issues.
              </p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">
                Return to Community Hub
              </a>
            </div>
          </body>
        </html>
        `,
        {
          headers: {
            "Content-Type": "text/html",
          },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribe Error - Community Hub</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
              background-color: #f6f9fc;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            .error {
              color: #dc3545;
              font-size: 48px;
              margin-bottom: 20px;
            }
            h1 {
              color: #111827;
              margin-bottom: 10px;
            }
            p {
              color: #6b7280;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
            }
            .button:hover {
              background-color: #1d4ed8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">✗</div>
            <h1>System Error</h1>
            <p>
              An unexpected error occurred while processing your unsubscribe request.
              Please try again later or contact support.
            </p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">
              Return to Community Hub
            </a>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
        status: 500,
      }
    );
  }
}
