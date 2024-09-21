import { Star } from "lucide-react";

interface FeedbackProps {
  feedback: {
    id: string;
    message: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    createdAt: Date;
  };
}

export default function FeedbackCard({ feedback }: FeedbackProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-neutral-100 px-6 py-6 dark:bg-zinc-900">
      <div className="flex items-center gap-1">
        {Array.from({ length: feedback.rating }, (_, index) => {
          return <Star key={index} className="fill-current text-yellow-400" />;
        })}
      </div>

      <p className="font-medium text-neutral-500 dark:text-neutral-400">
        {feedback.message}
      </p>

      <div className="flex w-full items-center">
        <div className="w-1/2">
          <p className="font-medium">Name</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {feedback.customerName}
          </p>
        </div>

        <div className="w-1/2">
          <p className="font-medium">Email</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {feedback.customerEmail}
          </p>
        </div>
      </div>

      <div>
        <p className="font-medium">Submitted at</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {new Date(feedback.createdAt).toLocaleString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
