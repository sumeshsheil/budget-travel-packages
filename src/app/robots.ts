import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/api/", "/customer/", "/agent/"],
    },
    sitemap: "https://budgettravelpackages.in/sitemap.xml",
  };
}
