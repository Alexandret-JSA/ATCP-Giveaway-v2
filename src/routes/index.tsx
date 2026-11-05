import { createFileRoute } from "@tanstack/react-router";

import { Landing } from "@/components/atcp/Landing";

const TITLE = "ATCP Tree Care MasterClass Giveaway";
const DESC =
  "Win 1-on-1 coaching with a 7-figure tree service owner. 4 winners, 4 coaches, free to enter.";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
