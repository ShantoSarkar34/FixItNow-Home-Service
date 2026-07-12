import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CtaBanner } from "@/components/sections/cta-banner";
import { FeaturedCategories } from "@/components/sections/featured-categories";
import { FeaturedTechnicians } from "@/components/sections/featured-technicians";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustBar } from "@/components/sections/trust-bar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <FeaturedCategories />
        <FeaturedTechnicians />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
