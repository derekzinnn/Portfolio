import { Hero } from "@/components/sections/hero";
import { Positioning } from "@/components/sections/positioning";
import { FeaturedWork } from "@/components/sections/featured-work";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Positioning />
      <FeaturedWork />
      <About />
      <Contact />
    </>
  );
}
