import { signIn } from "@/lib/auth";
import { Button } from "./ui/button";
import { GoogleSVG } from "@/icons/Google";

export default function SignInComponent() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-5 py-12">
      <form
        className="shadow-card-raised w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 text-center"
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: "/dashboard",
          });
        }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Sign in to useFeedback
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600">
          Pick up where you left off.
        </p>

        <Button type="submit" variant="outline" className="mt-8 h-11 w-full">
          <GoogleSVG />
          Continue with Google
        </Button>
      </form>
    </main>
  );
}
