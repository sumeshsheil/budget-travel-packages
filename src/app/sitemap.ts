import { MetadataRoute } from "next";
import { getPosts, getCategories } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://budgettravelpackages.in";

  // Static routes
  const staticRoutes = ["", "/blogs"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // Fetch data concurrently
    const [{ posts }, categories] = await Promise.all([
      getPosts(),
      getCategories(),
    ]);

    // Categories routes
    const categoryRoutes = categories.map((category) => ({
      url: `${baseUrl}/blogs/category/${category.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Dynamic blog posts
    const blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: new Date(post.date).toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback to static routes if fetching fails
    return staticRoutes;
  }
}
