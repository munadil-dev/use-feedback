import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInComponent from "@/components/sign-in";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  const { error } = await searchParams;

  return <SignInComponent error={error} />;
}
