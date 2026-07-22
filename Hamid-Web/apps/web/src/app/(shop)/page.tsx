import { Suspense } from "react";
import Hero from "@/sections/Hero";
import PromoBanner from "@/sections/PromoBanner";
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
import { getDict } from "@/lib/i18n";

// Each of these sections independently fetches its own data (hero slides,
// featured products, best sellers, branches, ...). Without Suspense, sibling
// async Server Components render one after another — each `await` blocks the
// next section from even starting — so a page with ~5 data-fetching sections
// paid for the SUM of every query's latency instead of the max. Wrapping
// each in its own boundary lets the server kick off (and stream in) all of
// them concurrently instead of one at a time.
export default async function Home() {
  const dict = await getDict();
  return (
    <>
      <Suspense fallback={<div className="h-[56svh] md:h-[600px]" />}>
        <Hero />
      </Suspense>
      <Suspense fallback={null}>
        <PromoBanner placement="home_top" />
      </Suspense>
      <Suspense fallback={null}>
        <FeaturedProducts />
      </Suspense>
      <Categories />
      <About />
      <ImmersiveExperience />
      <Suspense fallback={null}>
        <BestSellers />
      </Suspense>
      <Testimonials />
      <InstagramGallery />
      <Suspense fallback={null}>
        <Locations />
      </Suspense>
      <Newsletter dict={dict} />
      <HeritageStory />
    </>
  );
}
