// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "https://GITHUB_USERNAME.github.io",
  base: "/personal-website",
  integrations: [mdx(), sitemap(), vue()],

  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
});
