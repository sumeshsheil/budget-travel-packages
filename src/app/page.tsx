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

export default async function Home() {


  return (
    <>
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
