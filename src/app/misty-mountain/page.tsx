import React from "react";

const AdminDashboard = () => {
  return (
    <section className="bg-background text-foreground p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard</h1>
      <p className="text-muted-foreground">
        Use the sidebar to manage your menus, specials, and business details. If you need help, reach out anytime.
      </p>
    </section>
  );
};

export default AdminDashboard;