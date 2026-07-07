// ─────────────────────────────────────────────────────────────────────────────
// MENU DATA — Edit this file to manage your café menu.
// Every change here is reflected on the /menu page on the next page load.
// When you connect a real CMS (Sanity, Contentful, Supabase…), replace this
// file's export with a fetch call — the API route and frontend page stay the same.
// ─────────────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  badge?: string; // e.g. "New", "Popular", "Seasonal"
}

export interface MenuSection {
  id: string;       // used as the URL anchor, e.g. "coffee"
  title: string;
  icon: string;     // Material Symbols icon ligature
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  // ── 1. Coffee ──────────────────────────────────────────────────────────────
  {
    id: "coffee",
    title: "Coffee",
    icon: "coffee",
    items: [
      {
        id: "espresso",
        name: "Espresso",
        description: "A concentrated shot of rich, dark Egyptian-blend espresso.",
        price: "EGP 45",
        badge: "Popular",
      },
      {
        id: "double-espresso",
        name: "Double Espresso",
        description: "Two concentrated shots for a deeper, bolder experience.",
        price: "EGP 60",
      },
      {
        id: "americano",
        name: "Americano",
        description: "Espresso diluted with hot water for a clean, smooth cup.",
        price: "EGP 55",
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Equal parts espresso, steamed milk, and thick velvety foam.",
        price: "EGP 75",
        badge: "Popular",
      },
      {
        id: "latte",
        name: "Café Latte",
        description: "Smooth espresso with generous steamed milk and a light foam crown.",
        price: "EGP 80",
      },
      {
        id: "flat-white",
        name: "Flat White",
        description: "Ristretto shots with microfoam milk — intense and silky.",
        price: "EGP 85",
      },
      {
        id: "turkish-coffee",
        name: "Turkish Coffee",
        description: "Traditional Egyptian-style coffee simmered in a cezve, served with cardamom.",
        price: "EGP 50",
        badge: "Heritage",
      },
      {
        id: "arabic-coffee",
        name: "Arabic Coffee",
        description: "Unfiltered, lightly roasted coffee with saffron and cardamom notes.",
        price: "EGP 55",
      },
    ],
  },

  // ── 2. Hot Drinks ──────────────────────────────────────────────────────────
  {
    id: "hot-drinks",
    title: "Hot Drinks",
    icon: "local_cafe",
    items: [
      {
        id: "hot-chocolate",
        name: "Hot Chocolate",
        description: "Rich dark chocolate melted into steamed whole milk.",
        price: "EGP 75",
      },
      {
        id: "matcha-latte",
        name: "Matcha Latte",
        description: "Ceremonial-grade matcha whisked with oat milk.",
        price: "EGP 90",
        badge: "New",
      },
      {
        id: "chai-latte",
        name: "Masala Chai Latte",
        description: "Black tea with ginger, cinnamon, cardamom, and steamed milk.",
        price: "EGP 70",
      },
      {
        id: "mint-tea",
        name: "Fresh Mint Tea",
        description: "A pot of boiling water with fresh Nile Valley spearmint.",
        price: "EGP 40",
      },
      {
        id: "hibiscus",
        name: "Karkadeh (Hibiscus)",
        description: "Hot-brewed hibiscus flowers — tart, floral, deeply Egyptian.",
        price: "EGP 45",
        badge: "Heritage",
      },
      {
        id: "anise-tea",
        name: "Anise Tea",
        description: "Warming anise seeds brewed to a fragrant, comforting tisane.",
        price: "EGP 40",
      },
    ],
  },

  // ── 3. Iced Coffee ─────────────────────────────────────────────────────────
  {
    id: "iced-coffee",
    title: "Iced Coffee",
    icon: "ac_unit",
    items: [
      {
        id: "cold-brew",
        name: "Cold Brew",
        description: "12-hour cold-steeped coffee — smooth, low-acidity, naturally sweet.",
        price: "EGP 85",
        badge: "Popular",
      },
      {
        id: "iced-latte",
        name: "Iced Latte",
        description: "Double espresso over ice with chilled whole milk.",
        price: "EGP 80",
      },
      {
        id: "iced-americano",
        name: "Iced Americano",
        description: "Espresso shots over ice with cold water. Clean and bold.",
        price: "EGP 65",
      },
      {
        id: "iced-matcha",
        name: "Iced Matcha Latte",
        description: "Ceremonial matcha shaken with oat milk over ice.",
        price: "EGP 95",
        badge: "New",
      },
      {
        id: "dalgona",
        name: "Dalgona Coffee",
        description: "Whipped instant coffee cloud over iced milk. Silky and indulgent.",
        price: "EGP 90",
      },
      {
        id: "espresso-tonic",
        name: "Espresso Tonic",
        description: "Chilled tonic water topped with a ristretto shot. Unexpectedly refreshing.",
        price: "EGP 95",
        badge: "Seasonal",
      },
    ],
  },

  // ── 4. Fresh Juice ─────────────────────────────────────────────────────────
  {
    id: "fresh-juice",
    title: "Fresh Juice",
    icon: "local_bar",
    items: [
      {
        id: "orange-juice",
        name: "Fresh Orange Juice",
        description: "Cold-pressed Valencia oranges. Nothing else.",
        price: "EGP 65",
        badge: "Popular",
      },
      {
        id: "mango-juice",
        name: "Mango Juice",
        description: "Egyptian Alphonso mangoes blended fresh to order.",
        price: "EGP 70",
        badge: "Seasonal",
      },
      {
        id: "sugarcane",
        name: "Sugarcane Juice",
        description: "Fresh-pressed sugarcane with a squeeze of lime.",
        price: "EGP 55",
        badge: "Heritage",
      },
      {
        id: "guava-juice",
        name: "Guava Juice",
        description: "Ripe Egyptian guava blended with a pinch of salt and lime.",
        price: "EGP 60",
      },
      {
        id: "pomegranate",
        name: "Pomegranate Juice",
        description: "Cold-pressed ruby pomegranates — antioxidant-rich and vibrant.",
        price: "EGP 80",
      },
      {
        id: "green-detox",
        name: "Green Detox",
        description: "Cucumber, green apple, ginger, spinach, and mint.",
        price: "EGP 85",
        badge: "New",
      },
    ],
  },

  // ── 5. Cocktails (Non-Alcoholic / Mocktails) ───────────────────────────────
  {
    id: "cocktails",
    title: "Cocktails",
    icon: "wine_bar",
    items: [
      {
        id: "virgin-mojito",
        name: "Virgin Mojito",
        description: "Fresh mint, lime, brown sugar, soda water and a mountain of crushed ice.",
        price: "EGP 75",
        badge: "Popular",
      },
      {
        id: "passion-fruit-fizz",
        name: "Passion Fruit Fizz",
        description: "Passion fruit purée, vanilla syrup, tonic water, and lime.",
        price: "EGP 85",
      },
      {
        id: "watermelon-basil",
        name: "Watermelon Basil Smash",
        description: "Muddled basil, fresh watermelon juice, lemon, and soda.",
        price: "EGP 80",
        badge: "Seasonal",
      },
      {
        id: "hibiscus-spritz",
        name: "Hibiscus Spritz",
        description: "Karkadeh concentrate, elderflower, sparkling water, fresh mint.",
        price: "EGP 90",
        badge: "New",
      },
      {
        id: "mango-chili",
        name: "Mango Chili Cooler",
        description: "Fresh mango, a pinch of chili, lime juice, and ginger beer.",
        price: "EGP 85",
      },
      {
        id: "blue-lagoon",
        name: "Blue Lagoon",
        description: "Blue curaçao syrup, lemon juice, and lemonade. Striking and refreshing.",
        price: "EGP 80",
      },
    ],
  },

  // ── 6. Milkshakes ──────────────────────────────────────────────────────────
  {
    id: "milkshakes",
    title: "Milkshakes",
    icon: "bakery_dining",
    items: [
      {
        id: "classic-vanilla",
        name: "Classic Vanilla",
        description: "Madagascar vanilla bean ice cream blended to velvet perfection.",
        price: "EGP 85",
      },
      {
        id: "dark-chocolate-shake",
        name: "Dark Chocolate",
        description: "70% dark chocolate ice cream with a dash of espresso.",
        price: "EGP 95",
        badge: "Popular",
      },
      {
        id: "salted-caramel-shake",
        name: "Salted Caramel",
        description: "House-made caramel swirled with sea salt and vanilla ice cream.",
        price: "EGP 95",
      },
      {
        id: "lotus-shake",
        name: "Lotus Biscoff",
        description: "Creamy Biscoff spread blended with ice cream and topped with a cookie.",
        price: "EGP 105",
        badge: "Popular",
      },
      {
        id: "strawberry-shake",
        name: "Fresh Strawberry",
        description: "Real strawberries blended with ice cream — no artificial flavour.",
        price: "EGP 90",
      },
      {
        id: "nutella-shake",
        name: "Nutella Dream",
        description: "Nutella, hazelnut ice cream, and a swirl of whipped cream.",
        price: "EGP 105",
      },
    ],
  },

  // ── 7. Smoothies ───────────────────────────────────────────────────────────
  {
    id: "smoothies",
    title: "Smoothies",
    icon: "blender",
    items: [
      {
        id: "tropical-blend",
        name: "Tropical Blend",
        description: "Mango, pineapple, passion fruit, and coconut milk.",
        price: "EGP 90",
        badge: "Popular",
      },
      {
        id: "berry-blast",
        name: "Mixed Berry Blast",
        description: "Strawberry, blueberry, raspberry, and Greek yoghurt.",
        price: "EGP 90",
      },
      {
        id: "banana-peanut",
        name: "Banana Peanut Butter",
        description: "Frozen banana, natural peanut butter, oat milk, and honey.",
        price: "EGP 95",
        badge: "New",
      },
      {
        id: "avocado-banana",
        name: "Avocado Banana",
        description: "Creamy avocado, banana, honey, and almond milk.",
        price: "EGP 100",
      },
      {
        id: "spinach-apple",
        name: "Spinach Apple Detox",
        description: "Baby spinach, green apple, cucumber, lemon, and ginger.",
        price: "EGP 85",
      },
    ],
  },

  // ── 8. Soft Drinks ─────────────────────────────────────────────────────────
  {
    id: "soft-drinks",
    title: "Soft Drinks",
    icon: "sports_bar",
    items: [
      {
        id: "cola",
        name: "Coca-Cola",
        description: "330 ml chilled can.",
        price: "EGP 35",
      },
      {
        id: "diet-cola",
        name: "Diet Coke",
        description: "330 ml chilled can.",
        price: "EGP 35",
      },
      {
        id: "sparkling-water",
        name: "Sparkling Water",
        description: "330 ml chilled can.",
        price: "EGP 30",
      },
      {
        id: "still-water",
        name: "Still Water",
        description: "500 ml chilled bottle.",
        price: "EGP 20",
      },
      {
        id: "lemon-soda",
        name: "Lemon Mint Soda",
        description: "Fresh lemon juice, mint leaves, and sparkling water over ice.",
        price: "EGP 50",
        badge: "Popular",
      },
      {
        id: "ginger-beer",
        name: "Ginger Beer",
        description: "330 ml of spicy, natural ginger beer.",
        price: "EGP 55",
      },
      {
        id: "energy",
        name: "Energy Drink",
        description: "250 ml chilled can.",
        price: "EGP 65",
      },
    ],
  },

  // ── 9. Desserts ────────────────────────────────────────────────────────────
  {
    id: "desserts",
    title: "Desserts",
    icon: "cake",
    items: [
      {
        id: "umm-ali",
        name: "Umm Ali",
        description: "Egypt's beloved bread pudding with cream, nuts, and raisins, served warm.",
        price: "EGP 85",
        badge: "Heritage",
      },
      {
        id: "kunafa",
        name: "Kunafa Slice",
        description: "Shredded pastry with sweet cream cheese and rose-water syrup.",
        price: "EGP 75",
        badge: "Popular",
      },
      {
        id: "chocolate-fondant",
        name: "Chocolate Fondant",
        description: "Warm dark chocolate cake with a molten centre, served with vanilla ice cream.",
        price: "EGP 120",
      },
      {
        id: "lotus-cheesecake",
        name: "Lotus Cheesecake",
        description: "New York-style cheesecake with a Biscoff crust and caramel drizzle.",
        price: "EGP 110",
        badge: "Popular",
      },
      {
        id: "tiramisu",
        name: "Tiramisu",
        description: "Espresso-soaked ladyfingers with mascarpone cream and cocoa dust.",
        price: "EGP 115",
      },
      {
        id: "basbousa",
        name: "Basbousa",
        description: "Traditional Egyptian semolina cake soaked in rose-water syrup.",
        price: "EGP 55",
        badge: "Heritage",
      },
      {
        id: "creme-brulee",
        name: "Crème Brûlée",
        description: "Vanilla custard with a perfectly caramelized sugar crust.",
        price: "EGP 110",
      },
    ],
  },
];
