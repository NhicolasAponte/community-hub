import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case "CredentialsSignin":
        return "Invalid email or password. Please try again.";
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The sign in link is no longer valid. It may have expired.";
      default:
        return "An error occurred during authentication.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6 py-12 text-center">
        <div className="mb-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">{getErrorMessage(error)}</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Link>

          <div>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              Error code: <code className="text-red-500">{error}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
