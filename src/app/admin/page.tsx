import React from "react";
import { auth } from "@/auth";
import SignOutButton from "@/components/auth/sign-out-button";

const AdminDashboard = async () => {
  const session = await auth();

  return (
    <section className="bg-background text-foreground p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            Welcome, {session?.user?.name || session?.user?.email}!
          </h1>
          <p className="text-muted-foreground">
            Use the sidebar to manage your menus, specials, and business
            details. If you need help, reach out anytime.
          </p>
        </div>

        <SignOutButton className="text-red-600 hover:text-red-800" />
      </div>

      {/* User session info for debugging */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium mb-2">
            Session Info (Development)
          </h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
