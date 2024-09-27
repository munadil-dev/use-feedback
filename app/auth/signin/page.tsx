import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInComponent from "@/components/sign-in";

export default async function SignIn() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return <SignInComponent />;
}
