import FeaturedHero from "@/components/blog/FeaturedHero";
import CategorySection from "@/components/blog/CategorySection";
import Newsletter from "@/components/blog/Newsletter";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getFeaturedPosts, getPostsByCategory } from "@/lib/wordpress/api";

export const metadata = {
  title: "Budget Travel Blog | Travel Guides, Tips & Trip Ideas",
  description:
    "Explore travel guides, budget travel tips and destination ideas across India and worldwide. Plan smarter trips with expert insights from Budget Travel Packages. ✈️🌍",
};

// Category configuration — defines the 3 sections
const CATEGORIES = [
  {
    slug: "domestic",
    title: "Domestic Travel",
    description:
      "Discover hidden gems across India — from the snow-capped Himalayas to the sun-kissed beaches of Goa. Explore budget-friendly packages for every kind of traveler.",
    icon: "",
    accentColor: "blue",
  },
  {
    slug: "international",
    title: "International Travel",
    description:
      "Dream big, travel bigger. Explore affordable international destinations with our curated travel guides, visa tips, and budget-friendly itineraries.",
    icon: "",
    accentColor: "purple",
  },
  {
    slug: "insights",
    title: "Travel Insights",
    description:
      "Get expert travel tips, guides, and insights from seasoned travelers. From booking hacks to destination deep-dives, we cover everything you need to know before your next adventure.",
    icon: "",
    accentColor: "orange",
  },
];

export default async function BlogsPage() {
  // Fetch featured post
  const featuredPosts = await getFeaturedPosts(1);
  const featuredPost = featuredPosts[0];

  // Fetch posts for each category in parallel
  const categoryData = await Promise.all(
    CATEGORIES.map(async (cat) => {
      const { posts, total } = await getPostsByCategory(cat.slug, 6);
      return { ...cat, posts, total };
    }),
  );

  return (
    <>
      {/* Featured Blog Post */}
      {featuredPost && <FeaturedHero post={featuredPost} />}

      <div className="bg-white border-b border-gray-100 py-4 shadow-xs">
        <div className="container-box px-4">
          <Breadcrumbs />
        </div>
      </div>

      {/* Category Sections */}
      {categoryData.map((cat, index) => (
        <div
          key={cat.slug}
          className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
        >
          <CategorySection
            title={cat.title}
            description={cat.description}
            slug={cat.slug}
            posts={cat.posts}
            totalPosts={cat.total}
            icon={cat.icon}
            accentColor={cat.accentColor}
          />
        </div>
      ))}

      {/* Newsletter Subscription */}
      <Newsletter />

      {/* Empty state if no content at all */}
      {!featuredPost && categoryData.every((c) => c.posts.length === 0) && (
        <div className="container-box px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            No blog posts found.
          </h2>
          <p className="text-gray-500 mt-2">
            Check back later for updates! We&apos;re adding new content soon.
          </p>
        </div>
      )}
    </>
  );
}
