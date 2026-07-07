import Hero from "@/sections/Hero";
import HeritageStory from "@/sections/HeritageStory";
import FeaturedProducts from "@/sections/FeaturedProducts";
import Categories from "@/sections/Categories";
import About from "@/sections/About";
import ImmersiveExperience from "@/sections/ImmersiveExperience";
import BestSellers from "@/sections/BestSellers";
import Testimonials from "@/sections/Testimonials";
import InstagramGallery from "@/sections/InstagramGallery";
import Locations from "@/sections/Locations";
import Newsletter from "@/sections/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <About />
      <ImmersiveExperience />
      <BestSellers />
      <Testimonials />
      <InstagramGallery />
      <Locations />
      <Newsletter />
      <HeritageStory />
    </>
  );
}
