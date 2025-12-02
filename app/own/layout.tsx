import Container from "@/components/Container";
import Section from "@/components/Section";
import { Button } from "@/components/ui/button";
import { auth } from "../auth";
import { sql } from "@vercel/postgres";
import Sidebar from "../components/SIdeBar";
import { redirect } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || !session.user) {
    return redirect("/login");
  }

  const ownedTable = await sql.query(
    `SELECT * FROM owned_table WHERE "userId"=$1`,
    [session?.user.userId]
  );
  return (
    <Container className=" flex gap-y-4  dark:bg-gradient-to-r dark:from-black dark:via-transparent dark:to-black">
      <TooltipProvider delayDuration={200}>
        <Sidebar links={ownedTable.rows} />
      </TooltipProvider>
      <Section type="b" className="w-full  h-screen box-border  p-0 ">
        {children}
      </Section>
    </Container>
  );
}
