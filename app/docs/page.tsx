import Link from "next/link";

export default function Docs() {
  return (
    <main className="flex justify-center p-8">
      <section className="container mx-auto flex w-[90vw] flex-col gap-6 sm:w-[80vw] md:w-[70vw] lg:w-[60vw]">
        <h1 className="mb-4 text-4xl font-semibold">Documentation</h1>

        <p className="text-2xl font-medium">Step 1. Create a product</p>
        <p>
          Log in to your{" "}
          <Link href="/dashboard" className="text-sky-600 underline">
            dashboard
          </Link>{" "}
          with your newly created account. Click &quot;Create a new
          product&quot; button and fill the product details.
        </p>

        <p className="text-2xl font-medium">
          Step 2. Share the Link with Customers
        </p>
        <p>
          Copy the link by clicking &quot;Copy to clipboard&quot; button.
          Distribute this link to your customers to gather feedbacks for your
          products.
        </p>

        <p className="text-2xl font-medium">Step 3. View Feedbacks</p>
        <p>
          Navigate to the{" "}
          <Link href="/dashboard" className="text-sky-600 underline">
            dashboard
          </Link>{" "}
          to see all the products you have created. Select a product to review
          and analyze the feedback submitted by your customers.
        </p>

        <p className="text-2xl font-medium">
          Step 4. Embed Feedback on Your Website
        </p>
        <p>
          To embed feedback on your website, copy the code from your product in
          the dashboard and paste this code into your website&apos;s HTML where
          you want the feedback to appear, and update your site to display the
          feedback widget.
        </p>
      </section>
    </main>
  );
}
