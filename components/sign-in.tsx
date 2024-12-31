import { signIn } from "@/lib/auth";
import { Button } from "./ui/button";
import { GoogleSVG } from "@/icons/Google";

export default function SignInComponent() {
  return (
    <main className="flex min-h-[80svh] items-center">
      <form
        className="flex flex-[5] flex-col items-center gap-2 p-8 text-center"
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: "/dashboard",
          });
        }}
      >
        <h1 className="text-4xl font-semibold">Welcome back!</h1>

        <p className="font-medium text-black/80 dark:text-white/80">
          Sign in to continue
        </p>

        <Button type="submit" className="mt-8 flex gap-6 text-base font-medium">
          <GoogleSVG />
          Sign in with Google
        </Button>
      </form>

      <section className="mr-10 hidden rounded-3xl p-2 dark:bg-white/10 lg:block">
        <img
          className="aspect-video rounded-3xl object-cover lg:h-[50vh] lg:w-[40rem] xl:h-[60vh] xl:w-[45rem]"
          alt="UseFeedback dashboard on Sign in page"
          src={"/images/sign-in.png"}
        />
      </section>
    </main>
  );
}
