import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GetGoing - Build Habits, Crush Goals",
    short_name: "GetGoing",
    description:
      "Your AI-powered productivity companion for building sustainable habits and achieving meaningful goals.",
    start_url: "/",
    display: "standalone",
    background_color: "#6366f1",
    theme_color: "#6366f1",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/logo-penguin.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/logo-penguin.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["productivity", "lifestyle", "health"],
    lang: "en",
  }
}
