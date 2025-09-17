import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInForm from "@/components/forms/sign-in-form";
import { signInAction } from "@/lib/data/auth-actions";
import { UserRoles } from "@/lib/data-model/enum-types";

export default async function SignInPage() {
  // Check if user is already authenticated
  const session = await auth();

  if (session?.user) {
    // If user is already signed in, redirect to admin if they're an admin
    // or to home page if they're a regular user
    if (session.user.role === UserRoles.ADMIN) {
      redirect("/admin");
    } else {
      redirect("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6 py-12">
        <SignInForm action={signInAction} />
      </div>
    </div>
  );
}
