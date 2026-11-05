import { createFileRoute } from "@tanstack/react-router";

import { ThankYou } from "@/components/atcp/ThankYou";

export const Route = createFileRoute("/thank-you")({
  // The home entry form redirects here with ?email=... so the newsletter field
  // can be pre-filled. Defaults to an empty string when the param is absent.
  validateSearch: (search) => ({
    email: typeof search["email"] === "string" ? search["email"] : "",
  }),
  component: ThankYou,
  head: () => ({
    meta: [
      { title: "You’re Almost Done · ATCP Giveaway" },
      // The thank-you page must never be a landing page for ads or search.
      { name: "robots", content: "noindex" },
    ],
  }),
});
