// @ts-check
const { themes: prismThemes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Evix",
  tagline: "Real-Time Execution Infrastructure for On-Chain Trading",
  favicon: "img/favicon.ico",

  url: "https://docs.evix.trade",
  baseUrl: "/",

  organizationName: "evix-trade",
  projectName: "evix",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        logo: {
          alt: "Evix Logo",
          src: "img/logo-dark.svg",
          srcDark: "img/logo-light.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docsSidebar",
            position: "left",
            label: "Documentation",
          },
          {
            href: "https://github.com/evix-trade/evix",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              { label: "Overview", to: "/" },
              { label: "Quickstart", to: "/getting-started/quickstart" },
              { label: "API Reference", to: "/api/contract" },
            ],
          },
          {
            title: "SDKs",
            items: [
              { label: "TypeScript", to: "/api/typescript-sdk" },
              { label: "Rust", to: "/api/rust-sdk" },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/evix-trade/evix",
              },
              {
                label: "Inductiv",
                href: "https://inductiv.io",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Inductiv.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["solidity", "rust", "toml", "bash"],
      },
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
      },
    }),
};

module.exports = config;
