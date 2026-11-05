import { createFileRoute } from "@tanstack/react-router";

import { ThankYou } from "@/components/atcp/ThankYou";

export const Route = createFileRoute("/thank-you")({
  component: ThankYou,
  head: () => ({
    meta: [
      { title: "You’re Almost Done · ATCP Giveaway" },
      // The thank-you page must never be a landing page for ads or search.
      { name: "robots", content: "noindex" },
    ],
  }),
});
