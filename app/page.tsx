import FeaturedRigs from "@/components/Featurerigs";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HomeFaq from "@/components/HomeFaq";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Themer from "@/components/Themer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* <Navbar /> */}
      <Hero />
      <FeaturedRigs />
      <HowItWorks />
      <HomeFaq />
      {/* <Footer /> */}
    </main>
  );
}