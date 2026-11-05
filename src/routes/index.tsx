import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ATCP Giveaway v2" },
      { name: "description", content: "ATCP Giveaway v2" },
      { property: "og:title", content: "ATCP Giveaway v2" },
      { property: "og:description", content: "ATCP Giveaway v2" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-foreground text-3xl font-semibold">ATCP Giveaway v2</h1>
    </div>
  );
}
