import BookYourTrip from "@/components/landing/sections/BookYourTrip";
import CityOperations from "@/components/landing/sections/CityOperations";
import FAQ from "@/components/landing/sections/FAQ";
import FeaturedIn from "@/components/landing/sections/FeaturedIn";
import Footer from "@/components/landing/sections/Footer";
import Hero from "@/components/landing/sections/Hero";
import PopularPackages from "@/components/landing/sections/PopularPackages";
import ServicesWeOffer from "@/components/landing/sections/ServicesWeOffer";
import TravelSmartCTA from "@/components/landing/sections/TravelSmartCTA";
import WhyChooseUs from "@/components/landing/sections/WhyChooseUs";
import Header from "@/components/layout/Header";
import { getPosts } from "@/lib/wordpress/api";

export default async function Home() {
  const { posts } = await getPosts(1, 4);

  const articleSchemas = posts.map((post) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title?.rendered?.replace(/<[^>]*>?/gm, ""),
    description: post.excerpt?.rendered?.replace(/<[^>]*>?/gm, ""),
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date((post as any).modified || post.date).toISOString(),
    author: {
      "@type": "Person",
      name: post._embedded?.author?.[0]?.name || "Budget Travel Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Budget Travel Packages",
      logo: {
        "@type": "ImageObject",
        url: "https://budgettravelpackages.in/images/logo/logo.svg",
      },
    },
    image:
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
    url: `https://budgettravelpackages.in/blogs/${post.slug}`,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchemas) }}
      />
    
      <Header />
      <main>
        <Hero />
        <CityOperations />
        <PopularPackages />
        <BookYourTrip />
        <ServicesWeOffer />
        <WhyChooseUs />
        <FeaturedIn />
        <FAQ />
        <TravelSmartCTA />
      </main>
      <Footer />
    </>
  );
}
