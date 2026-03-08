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
    const categoryRoutes = categories.map((category) => {
      const slug = ["questions", "q-a", "qa"].includes(category.slug.toLowerCase()) || 
                   category.slug === "travel-insights" ? "insights" : category.slug;
      return {
        url: `${baseUrl}/blogs/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

    // Dynamic blog posts
    const blogRoutes = posts.map((post) => {
      const rawCategory = post._embedded?.["wp:term"]?.[0]?.[0]?.slug || "travel";
      const categorySlug = ["questions", "q-a", "qa"].includes(rawCategory.toLowerCase()) ||
                           rawCategory === "travel-insights" ? "insights" : rawCategory;
      return {
        url: `${baseUrl}/blogs/${categorySlug}/${post.slug}`,
        lastModified: new Date(post.date).toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    });

    return [...staticRoutes, ...categoryRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback to static routes if fetching fails
    return staticRoutes;
  }
}
