import { getDict, getLocale } from "@/lib/i18n";
import { getHomeHeroSlides, type HeroSlideView } from "@/lib/content/queries";
import { HeroSlider } from "@/components/HeroSlider";

/** Shown until slides are configured in Admin → Home Page (placement "home_hero"). */
const FALLBACK_SLIDE: HeroSlideView = {
  id: 0,
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDpHYKaDbPH4GDNtKVPFXtZA_RQayLx4Q7gQKg0H16FobXpLQeOsPLnO_u-vIfevbrfB9xCRnrTZFV7qiE0DvxCvIT0Q5UnEcAFzGwlrrLx1o0INue903Sge4CRIO9Y14O4Dq1pWkVdFiy-96OgrmCI0NhfTNLSYZzpJEAm3VroFQszH7TgqQdh8gRKH0-iTxNNydoDmu9H7rvCQ5GH68F3kuErH43q_tLimva8ReDWnUnrtboLxylOnXzvpoG0OAXJK7FcM3qK1RCi",
  linkUrl: null,
  title: null,
  subtitle: null,
  ctaText: null,
};

export default async function Hero() {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  const slides = await getHomeHeroSlides(locale);

  return (
    <HeroSlider
      slides={slides.length > 0 ? slides : [FALLBACK_SLIDE]}
      copy={{
        kicker: dict.home.hero.kicker,
        title: dict.home.hero.title,
        subtitle: dict.home.hero.subtitle,
        shopCoffee: dict.home.hero.shopCoffee,
        ourStory: dict.home.hero.ourStory,
      }}
    />
  );
}
