import { Session } from "next-auth";
import { auth } from "../auth";
import SignIn from "./sign-in";
import SignOut from "./sign-out";

const AuthButton = async () => {
  const session:Session | null = await auth();
  return  session?.user ? <SignOut /> : <SignIn className="absolute right-12 top-4 z-10" />;
};

export default AuthButton;
