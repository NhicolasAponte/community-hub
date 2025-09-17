import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6 py-12 text-center">
        <div className="mb-8">
          <div className="text-orange-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access the admin area.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>

          <div>
            <Link
              href="/auth/signin"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in with different account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
