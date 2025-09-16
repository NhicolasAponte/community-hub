export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    // Protect admin routes
    "/admin/:path*",
    // Don't run middleware on static files, API auth routes, or public assets
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
