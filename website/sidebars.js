/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    "index",
    "architecture",
    "execution-intelligence",
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "getting-started/quickstart",
        "getting-started/installation",
      ],
    },
    {
      type: "category",
      label: "Integration Guides",
      collapsed: false,
      items: [
        "integration/overview",
        "integration/basic-swap",
        "integration/bot-integration",
        "integration/smart-account",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      collapsed: false,
      items: [
        "api/contract",
        "api/typescript-sdk",
        "api/rust-sdk",
      ],
    },
    {
      type: "category",
      label: "Deployment",
      items: ["deployment/model"],
    },
    "pricing",
    {
      type: "category",
      label: "Security",
      items: ["security/overview"],
    },
    "faq",
  ],
};

module.exports = sidebars;
