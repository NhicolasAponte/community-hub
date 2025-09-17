import { redirect } from "next/navigation";
import CreateAdminForm from "@/components/forms/create-admin-form";

// Check if setup is required by calling our API
async function checkSetupRequired() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/create-first-admin`, {
      method: "GET",
      cache: "no-store", // Always check fresh
    });

    if (!response.ok) {
      throw new Error("Failed to check setup status");
    }

    const data = await response.json();
    return data.setupRequired;
  } catch (error) {
    console.error("Error checking setup status:", error);
    // If we can't check, allow access to be safe
    return true;
  }
}

export default async function AdminSetupPage() {
  const setupRequired = await checkSetupRequired();

  // If setup is not required (admin already exists), redirect to sign in
  if (!setupRequired) {
    redirect("/auth/signin?message=Admin user already exists");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Community Hub
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete the initial setup by creating your administrator account.
          </p>
        </div>

        <CreateAdminForm
          onSuccess={() => {
            // Redirect to sign in after successful creation
            window.location.href =
              "/auth/signin?message=Admin user created successfully";
          }}
        />

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Already have an admin account?{" "}
            <a
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
