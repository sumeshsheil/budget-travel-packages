import delhiImg from "@/../public/images/city/delhi.webp";
import kolkataImg from "@/../public/images/city/kolkata.webp";
import mumbaiImg from "@/../public/images/city/mumbai.webp";
import Image from "next/image";
import React from "react";
import { ScrollToButton } from "@/components/ui/ScrollToButton";

const cityData = [
  {
    id: "kolkata",
    title: "Budget Travel Packages In Kolkata",
    highlight: "In Kolkata",
    highlightColor: "text-[#C90000]",
    description:
      "Looking for affordable travel options from Kolkata? We specialize in customized domestic and international tour packages with smooth departures from Netaji Subhas Chandra Bose International Airport (CCU) and major railway stations like Howrah Junction (HWH), Sealdah (SDAH), Kolkata (KOAA), Shalimar (SHM) or Santragachi (SRC).",
    image: kolkataImg,
    alt: "Kolkata City Landmark - Howrah Bridge",
    imgPos: "left",
  },
  {
    id: "delhi",
    title: "Budget Travel Packages In Delhi",
    highlight: "In Delhi",
    highlightColor: "text-[#FFD700]",
    description:
      "Traveling from Delhi? Budget Travel Packages offers fully customized domestic and international tour packages with departures from Indira Gandhi International Airport (DEL) and major railway stations like New Delhi Railway Station (NDLS), Old Delhi (DLI), Hazrat Nizamuddin (NZM), Anand Vihar Terminal (ANVT) or Delhi Sarai Rohilla (DEE).",
    image: delhiImg,
    alt: "Delhi City Landmark - India Gate",
    imgPos: "right",
  },
  {
    id: "mumbai",
    title: "Budget Travel Packages In Mumbai",
    highlight: "In Mumbai",
    highlightColor: "text-primary",
    description:
      "Mumbai travelers can book budget friendly customized tour packages designed around flexible schedules and competitive flight options from Chhatrapati Shivaji Maharaj International Airport (BOM) and major railway stations like Chhatrapati Shivaji Maharaj Terminus (CSMT), Mumbai Central (MMCT) or Lokmanya Tilak Terminus (LTT).",
    image: mumbaiImg,
    alt: "Mumbai City Landmark - Gateway of India",
    imgPos: "left",
  },
];

const CityOperations: React.FC = () => {
  return (
    <section className=" pb-10 relative overflow-hidden bg-white">
      {/* City Content Blocks */}
      <div className="space-y-0">
        {cityData.map((city) => (
          <div key={city.id} id={city.id} className="relative w-full py-16 md:py-24 scroll-mt-24">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 container-box  w-full border-b-2 border-dashed border-secondary/50 z-20" />

            <div
              className={`absolute top-0 bottom-0 w-full h-full flex items-center ${
                city.imgPos === "left" ? "justify-start" : "justify-end"
              } pointer-events-none`}
            >
              <div className="relative h-full w-auto max-w-[50%]">
                <Image
                  src={city.image}
                  alt={city.alt}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
                  placeholder="blur"
                  loading="lazy"
                  className={`h-full w-auto object-contain object-bottom ${city.id === "delhi" ? "opacity-50" : ""}`}
                />
              </div>
            </div>

            <div className="container-box relative z-10">
              <div
                className={`flex flex-col lg:flex-row items-center justify-center`}
              >
                <div className="w-full max-w-[800px] flex flex-col items-center justify-center text-center px-4">
                  <h2 className="text-2xl md:text-3xl lg:text-[40px] font-inter font-bold text-black mb-4 lg:mb-4.5">
                    {city.title.replace(city.highlight, "")}
                    <span className={city.highlightColor}>
                      {" "}
                      {city.highlight}
                    </span>
                  </h2>
                  <p className="font-open-sans text-black text-sm md:text-base leading-relaxed mb-9">
                    {city.description}
                  </p>
                  <ScrollToButton
                    targetId="start-planning"
                    variant="default"
                    className="bg-new-blue text-white  text-sm md:text-base px-8 lg:px-16 py-2 rounded-full transition-all"
                  >
                    Customize My Trip
                  </ScrollToButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CityOperations;
