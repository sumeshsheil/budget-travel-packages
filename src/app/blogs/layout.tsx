import BlogHeader from "@/components/blog/BlogHeader";
import PromoBanner from "@/components/blog/PromoBanner";
import Footer from "@/components/landing/sections/Footer";
import Header from "@/components/layout/Header";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-[110px] md:pt-[130px] lg:pt-[100px] bg-white">
        <div className="sticky top-[64px] md:top-[90px] lg:top-[86px] z-40 shadow-sm transform-gpu will-change-transform bg-white">
          <PromoBanner />
          <BlogHeader />
        </div>

        <main className="min-h-screen">{children}</main>
      </div>
      <Footer />
    </>
  );
}
