import { createFileRoute } from "@tanstack/react-router";

import { LandingV2 } from "@/components/atcp/LandingV2";

const TITLE = "ATCP Tree Care MasterClass Giveaway (V2)";
const DESC =
  "Win 1-on-1 coaching with a 7-figure tree service owner. 4 winners, 4 coaches, free to enter.";

export const Route = createFileRoute("/v2")({
  component: LandingV2,
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
