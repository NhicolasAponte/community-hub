import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit" variant="ghost" className={className}>
        Sign Out
      </Button>
    </form>
  );
}
