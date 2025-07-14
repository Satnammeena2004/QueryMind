import Section from "@/components/Section";
import SignIn from "../components/sign-in";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

const Page = async () => {
  const session: Session | null = await auth();

  if (session?.user) {
    return redirect("/");
  }
  return (
    <Section
      type="b"
      className="w-full h-screen flex justify-center items-center"
    >
      <SignIn />
    </Section>
  );
};

export default Page;
