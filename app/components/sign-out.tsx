import { signIn, signOut } from "@/app/auth";
import { Button } from "@/components/ui/button";
import { AuthError } from "next-auth";
import { LogOut } from "lucide-react";

export default async function SignOut() {
  return (
    <form
      className="absolute right-12 top-4 z-10 "
      action={async () => {
        "use server";

        await signOut();
      }}
    >
      <Button className="flex gap-x-3 " type="submit">
        {" "}
        <LogOut />
        <span>Sign Out</span>
      </Button>
    </form>
  );
}
