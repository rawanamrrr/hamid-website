import "./env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { PERMISSION_SLUGS, ROLE_DEFINITIONS, permissionGroup } from "@hamid/core";
import * as schema from "./schema";

const {
  branches,
  permissions,
  roles,
  rolePermissions,
  users,
  userRoles,
  paymentMethods,
  settings,
  menuCategories,
  menuCategoryTranslations,
  menuItems,
  menuItemTranslations,
  storeCategories,
  storeCategoryTranslations,
  storeProducts,
  storeProductTranslations,
  media,
  storeProductMedia,
} = schema;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env and configure it.");

  const connection = await mysql.createConnection(url);
  const db = drizzle(connection, { schema, mode: "default" });

  const existing = await db.select({ id: roles.id }).from(roles).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded — aborting. Truncate tables manually if you want to reseed.");
    await connection.end();
    return;
  }

  console.log("Seeding branch...");
  const [branch] = await db
    .insert(branches)
    .values({ code: "MAIN", name: "Hamid Afandi — Main Branch", currency: "EGP" })
    .$returningId();

  console.log("Seeding permissions & roles...");
  const insertedPermissions = await db
    .insert(permissions)
    .values(PERMISSION_SLUGS.map((slug) => ({ slug, group: permissionGroup(slug) })))
    .$returningId();
  const permIdBySlug = new Map(PERMISSION_SLUGS.map((slug, i) => [slug, insertedPermissions[i].id]));

  const roleIdBySlug = new Map<string, number>();
  for (const def of ROLE_DEFINITIONS) {
    const [row] = await db.insert(roles).values({ slug: def.slug, name: def.name, isSystem: def.isSystem }).$returningId();
    roleIdBySlug.set(def.slug, row.id);
    if (def.permissions.length > 0) {
      await db.insert(rolePermissions).values(
        def.permissions.map((slug) => ({ roleId: row.id, permissionId: permIdBySlug.get(slug)! })),
      );
    }
  }

  console.log("Seeding super admin user...");
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "hanarabeea707@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const [adminUser] = await db
    .insert(users)
    .values({
      email: adminEmail,
      fullName: "Hamid Afandi Admin",
      passwordHash,
      status: "active",
      emailVerifiedAt: new Date(),
    })
    .$returningId();
  await db.insert(userRoles).values({ userId: adminUser.id, roleId: roleIdBySlug.get("super_admin")! });
  console.log(`  -> Super admin created: ${adminEmail} / ${adminPassword} (CHANGE THIS PASSWORD IMMEDIATELY)`);

  console.log("Seeding payment methods...");
  await db.insert(paymentMethods).values([
    { code: "cash_on_delivery", name: "Cash on Delivery", isActive: true, sortOrder: 1 },
    { code: "instapay", name: "InstaPay", isActive: true, sortOrder: 2 },
  ]);

  console.log("Seeding settings...");
  await db.insert(settings).values([
    { group: "site", key: "name", value: { en: "Hamid Afandi", ar: "حامد أفندي" } },
    { group: "site", key: "default_locale", value: "en" },
    { group: "site", key: "supported_locales", value: ["en", "ar"] },
    { group: "site", key: "currency", value: "EGP" },
    { group: "checkout", key: "tax_enabled", value: false },
    { group: "checkout", key: "fulfillment_types", value: ["delivery", "pickup"] },
    { group: "checkout", key: "guest_checkout_enabled", value: true },
    // Flat placeholder — replace with a real delivery-zone table once zones/fees are defined.
    { group: "checkout", key: "delivery_fee", value: "30.00" },
  ]);

  // ── Menu catalog ──────────────────────────────────────────────────────────
  console.log("Seeding menu catalog...");
  const menuCategoryDefs: {
    slug: string; icon: string; nameEn: string; nameAr: string;
    items: { slug: string; nameEn: string; descEn: string; price: string; badge?: string }[];
  }[] = [
    {
      slug: "coffee", icon: "coffee", nameEn: "Coffee", nameAr: "القهوة",
      items: [
        { slug: "espresso", nameEn: "Espresso", descEn: "A concentrated shot of rich, dark Egyptian-blend espresso.", price: "45.00", badge: "Popular" },
        { slug: "double-espresso", nameEn: "Double Espresso", descEn: "Two concentrated shots for a deeper, bolder experience.", price: "60.00" },
        { slug: "americano", nameEn: "Americano", descEn: "Espresso diluted with hot water for a clean, smooth cup.", price: "55.00" },
        { slug: "cappuccino", nameEn: "Cappuccino", descEn: "Equal parts espresso, steamed milk, and thick velvety foam.", price: "75.00", badge: "Popular" },
        { slug: "latte", nameEn: "Café Latte", descEn: "Smooth espresso with generous steamed milk and a light foam crown.", price: "80.00" },
        { slug: "flat-white", nameEn: "Flat White", descEn: "Ristretto shots with microfoam milk — intense and silky.", price: "85.00" },
        { slug: "turkish-coffee", nameEn: "Turkish Coffee", descEn: "Traditional Egyptian-style coffee simmered in a cezve, served with cardamom.", price: "50.00", badge: "Heritage" },
        { slug: "arabic-coffee", nameEn: "Arabic Coffee", descEn: "Unfiltered, lightly roasted coffee with saffron and cardamom notes.", price: "55.00" },
      ],
    },
    {
      slug: "hot-drinks", icon: "local_cafe", nameEn: "Hot Drinks", nameAr: "المشروبات الساخنة",
      items: [
        { slug: "hot-chocolate", nameEn: "Hot Chocolate", descEn: "Rich dark chocolate melted into steamed whole milk.", price: "75.00" },
        { slug: "matcha-latte", nameEn: "Matcha Latte", descEn: "Ceremonial-grade matcha whisked with oat milk.", price: "90.00", badge: "New" },
        { slug: "chai-latte", nameEn: "Masala Chai Latte", descEn: "Black tea with ginger, cinnamon, cardamom, and steamed milk.", price: "70.00" },
        { slug: "mint-tea", nameEn: "Fresh Mint Tea", descEn: "A pot of boiling water with fresh Nile Valley spearmint.", price: "40.00" },
        { slug: "hibiscus", nameEn: "Karkadeh (Hibiscus)", descEn: "Hot-brewed hibiscus flowers — tart, floral, deeply Egyptian.", price: "45.00", badge: "Heritage" },
        { slug: "anise-tea", nameEn: "Anise Tea", descEn: "Warming anise seeds brewed to a fragrant, comforting tisane.", price: "40.00" },
      ],
    },
    {
      slug: "iced-coffee", icon: "ac_unit", nameEn: "Iced Coffee", nameAr: "القهوة المثلجة",
      items: [
        { slug: "cold-brew", nameEn: "Cold Brew", descEn: "12-hour cold-steeped coffee — smooth, low-acidity, naturally sweet.", price: "85.00", badge: "Popular" },
        { slug: "iced-latte", nameEn: "Iced Latte", descEn: "Double espresso over ice with chilled whole milk.", price: "80.00" },
        { slug: "iced-americano", nameEn: "Iced Americano", descEn: "Espresso shots over ice with cold water. Clean and bold.", price: "65.00" },
        { slug: "iced-matcha", nameEn: "Iced Matcha Latte", descEn: "Ceremonial matcha shaken with oat milk over ice.", price: "95.00", badge: "New" },
        { slug: "dalgona", nameEn: "Dalgona Coffee", descEn: "Whipped instant coffee cloud over iced milk. Silky and indulgent.", price: "90.00" },
        { slug: "espresso-tonic", nameEn: "Espresso Tonic", descEn: "Chilled tonic water topped with a ristretto shot. Unexpectedly refreshing.", price: "95.00", badge: "Seasonal" },
      ],
    },
    {
      slug: "fresh-juice", icon: "local_bar", nameEn: "Fresh Juice", nameAr: "عصير طازج",
      items: [
        { slug: "orange-juice", nameEn: "Fresh Orange Juice", descEn: "Cold-pressed Valencia oranges. Nothing else.", price: "65.00", badge: "Popular" },
        { slug: "mango-juice", nameEn: "Mango Juice", descEn: "Egyptian Alphonso mangoes blended fresh to order.", price: "70.00", badge: "Seasonal" },
        { slug: "sugarcane", nameEn: "Sugarcane Juice", descEn: "Fresh-pressed sugarcane with a squeeze of lime.", price: "55.00", badge: "Heritage" },
        { slug: "guava-juice", nameEn: "Guava Juice", descEn: "Ripe Egyptian guava blended with a pinch of salt and lime.", price: "60.00" },
        { slug: "pomegranate", nameEn: "Pomegranate Juice", descEn: "Cold-pressed ruby pomegranates — antioxidant-rich and vibrant.", price: "80.00" },
        { slug: "green-detox", nameEn: "Green Detox", descEn: "Cucumber, green apple, ginger, spinach, and mint.", price: "85.00", badge: "New" },
      ],
    },
    {
      slug: "cocktails", icon: "wine_bar", nameEn: "Cocktails", nameAr: "الموكتيلات",
      items: [
        { slug: "virgin-mojito", nameEn: "Virgin Mojito", descEn: "Fresh mint, lime, brown sugar, soda water and a mountain of crushed ice.", price: "75.00", badge: "Popular" },
        { slug: "passion-fruit-fizz", nameEn: "Passion Fruit Fizz", descEn: "Passion fruit purée, vanilla syrup, tonic water, and lime.", price: "85.00" },
        { slug: "watermelon-basil", nameEn: "Watermelon Basil Smash", descEn: "Muddled basil, fresh watermelon juice, lemon, and soda.", price: "80.00", badge: "Seasonal" },
        { slug: "hibiscus-spritz", nameEn: "Hibiscus Spritz", descEn: "Karkadeh concentrate, elderflower, sparkling water, fresh mint.", price: "90.00", badge: "New" },
        { slug: "mango-chili", nameEn: "Mango Chili Cooler", descEn: "Fresh mango, a pinch of chili, lime juice, and ginger beer.", price: "85.00" },
        { slug: "blue-lagoon", nameEn: "Blue Lagoon", descEn: "Blue curaçao syrup, lemon juice, and lemonade. Striking and refreshing.", price: "80.00" },
      ],
    },
    {
      slug: "milkshakes", icon: "bakery_dining", nameEn: "Milkshakes", nameAr: "ميلك شيك",
      items: [
        { slug: "classic-vanilla", nameEn: "Classic Vanilla", descEn: "Madagascar vanilla bean ice cream blended to velvet perfection.", price: "85.00" },
        { slug: "dark-chocolate-shake", nameEn: "Dark Chocolate", descEn: "70% dark chocolate ice cream with a dash of espresso.", price: "95.00", badge: "Popular" },
        { slug: "salted-caramel-shake", nameEn: "Salted Caramel", descEn: "House-made caramel swirled with sea salt and vanilla ice cream.", price: "95.00" },
        { slug: "lotus-shake", nameEn: "Lotus Biscoff", descEn: "Creamy Biscoff spread blended with ice cream and topped with a cookie.", price: "105.00", badge: "Popular" },
        { slug: "strawberry-shake", nameEn: "Fresh Strawberry", descEn: "Real strawberries blended with ice cream — no artificial flavour.", price: "90.00" },
        { slug: "nutella-shake", nameEn: "Nutella Dream", descEn: "Nutella, hazelnut ice cream, and a swirl of whipped cream.", price: "105.00" },
      ],
    },
    {
      slug: "smoothies", icon: "blender", nameEn: "Smoothies", nameAr: "سموذي",
      items: [
        { slug: "tropical-blend", nameEn: "Tropical Blend", descEn: "Mango, pineapple, passion fruit, and coconut milk.", price: "90.00", badge: "Popular" },
        { slug: "berry-blast", nameEn: "Mixed Berry Blast", descEn: "Strawberry, blueberry, raspberry, and Greek yoghurt.", price: "90.00" },
        { slug: "banana-peanut", nameEn: "Banana Peanut Butter", descEn: "Frozen banana, natural peanut butter, oat milk, and honey.", price: "95.00", badge: "New" },
        { slug: "avocado-banana", nameEn: "Avocado Banana", descEn: "Creamy avocado, banana, honey, and almond milk.", price: "100.00" },
        { slug: "spinach-apple", nameEn: "Spinach Apple Detox", descEn: "Baby spinach, green apple, cucumber, lemon, and ginger.", price: "85.00" },
      ],
    },
    {
      slug: "soft-drinks", icon: "sports_bar", nameEn: "Soft Drinks", nameAr: "المشروبات الغازية",
      items: [
        { slug: "cola", nameEn: "Coca-Cola", descEn: "330 ml chilled can.", price: "35.00" },
        { slug: "diet-cola", nameEn: "Diet Coke", descEn: "330 ml chilled can.", price: "35.00" },
        { slug: "sparkling-water", nameEn: "Sparkling Water", descEn: "330 ml chilled can.", price: "30.00" },
        { slug: "still-water", nameEn: "Still Water", descEn: "500 ml chilled bottle.", price: "20.00" },
        { slug: "lemon-soda", nameEn: "Lemon Mint Soda", descEn: "Fresh lemon juice, mint leaves, and sparkling water over ice.", price: "50.00", badge: "Popular" },
        { slug: "ginger-beer", nameEn: "Ginger Beer", descEn: "330 ml of spicy, natural ginger beer.", price: "55.00" },
        { slug: "energy", nameEn: "Energy Drink", descEn: "250 ml chilled can.", price: "65.00" },
      ],
    },
    {
      slug: "desserts", icon: "cake", nameEn: "Desserts", nameAr: "الحلويات",
      items: [
        { slug: "umm-ali", nameEn: "Umm Ali", descEn: "Egypt's beloved bread pudding with cream, nuts, and raisins, served warm.", price: "85.00", badge: "Heritage" },
        { slug: "kunafa", nameEn: "Kunafa Slice", descEn: "Shredded pastry with sweet cream cheese and rose-water syrup.", price: "75.00", badge: "Popular" },
        { slug: "chocolate-fondant", nameEn: "Chocolate Fondant", descEn: "Warm dark chocolate cake with a molten centre, served with vanilla ice cream.", price: "120.00" },
        { slug: "lotus-cheesecake", nameEn: "Lotus Cheesecake", descEn: "New York-style cheesecake with a Biscoff crust and caramel drizzle.", price: "110.00", badge: "Popular" },
        { slug: "tiramisu", nameEn: "Tiramisu", descEn: "Espresso-soaked ladyfingers with mascarpone cream and cocoa dust.", price: "115.00" },
        { slug: "basbousa", nameEn: "Basbousa", descEn: "Traditional Egyptian semolina cake soaked in rose-water syrup.", price: "55.00", badge: "Heritage" },
        { slug: "creme-brulee", nameEn: "Crème Brûlée", descEn: "Vanilla custard with a perfectly caramelized sugar crust.", price: "110.00" },
      ],
    },
  ];

  let menuSort = 0;
  for (const cat of menuCategoryDefs) {
    const [catRow] = await db
      .insert(menuCategories)
      .values({ slug: cat.slug, icon: cat.icon, sortOrder: menuSort++, isActive: true })
      .$returningId();
    await db.insert(menuCategoryTranslations).values([
      { categoryId: catRow.id, locale: "en", name: cat.nameEn },
      { categoryId: catRow.id, locale: "ar", name: cat.nameAr },
    ]);

    let itemSort = 0;
    for (const item of cat.items) {
      const [itemRow] = await db
        .insert(menuItems)
        .values({
          categoryId: catRow.id,
          slug: item.slug,
          price: item.price,
          currency: "EGP",
          badge: item.badge,
          isNew: item.badge === "New",
          sortOrder: itemSort++,
          isActive: true,
        })
        .$returningId();
      await db.insert(menuItemTranslations).values({
        itemId: itemRow.id,
        locale: "en",
        name: item.nameEn,
        description: item.descEn,
      });
    }
  }

  // ── Store catalog ────────────────────────────────────────────────────────
  console.log("Seeding store catalog...");
  const storeCategoryDefs: { slug: string; nameEn: string; nameAr: string }[] = [
    { slug: "beans", nameEn: "Coffee Beans", nameAr: "حبوب القهوة" },
    { slug: "turkish", nameEn: "Turkish Coffee", nameAr: "قهوة تركي" },
    { slug: "espresso", nameEn: "Espresso", nameAr: "إسبريسو" },
    { slug: "accessories", nameEn: "Accessories", nameAr: "إكسسوارات" },
    { slug: "gifts", nameEn: "Gifts", nameAr: "هدايا" },
  ];
  const storeCategoryIdBySlug = new Map<string, number>();
  let storeCatSort = 0;
  for (const cat of storeCategoryDefs) {
    const [row] = await db
      .insert(storeCategories)
      .values({ slug: cat.slug, sortOrder: storeCatSort++, isActive: true })
      .$returningId();
    storeCategoryIdBySlug.set(cat.slug, row.id);
    await db.insert(storeCategoryTranslations).values([
      { categoryId: row.id, locale: "en", name: cat.nameEn },
      { categoryId: row.id, locale: "ar", name: cat.nameAr },
    ]);
  }

  const productDefs: {
    slug: string; nameEn: string; descEn: string; price: string; category: string;
    isBestSeller?: boolean; rating: string; imageUrl: string;
  }[] = [
    { slug: "afandi-signature", nameEn: "Afandi Signature Blend", descEn: "Our flagship blend combining Ethiopian and Brazilian origins for a balanced, complex cup.", price: "245.00", category: "beans", isBestSeller: true, rating: "4.9", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO3qDKQXh0zthabZhGghK70edShq3haEB1h7sRkctfUAUvCktpsQhD3od5976WV88c4RPNCIDUVXOiNGXtpupKNllLKdSxlA8U9NOZFVfGgfmrAubD3XVJx_WSeVw0oYszK-zZf8iJchMGQbziszcEzDxqeQ_hZKNQHlKu47tQPUFCAtCW0LkteupjF2PbRAvQSZPaP-4GP9ycLWUchY0LnUTMvXfNBq2s9LydUn-dzpdGPRA3yhlkMsZqL5rVMHl8aGGfdsUrcS22" },
    { slug: "classic-espresso", nameEn: "Classic Espresso", descEn: "Dark, rich and intensely aromatic. Perfect for those who love a strong, traditional cup.", price: "220.00", category: "espresso", rating: "4.8", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEcBBEWYoqKB1g9SMRo-PBOPa4ygrijePGjVQHlqBLsct3adHO8IXO36ofvFEDaYptN7N_nUVhsv9dIOJZkUagHWR4OR3zJLKQBJE-tZfVIkVAHo3W6c3ufPAdFDUDOTiErcfancpKo0w_oQ_JaY_RZ7LuItoW1_l8uF2j4U6p5BO1Nl1GEPHhoRpLr0eUY-w_vBt5gVlLzFmeUixkO0jQh8-url9VXwC2ivbJxKe-oeCPcnfgvTAph2dfF3TEUloq7XEpwtU33MXX" },
    { slug: "ethiopian-yirgacheffe", nameEn: "Ethiopian Yirgacheffe", descEn: "Bright floral notes with a sparkling citrus acidity. Our most awarded single-origin.", price: "310.00", category: "beans", rating: "5.0", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCualFC7dUe4fOId29Fhv_WOObJt0A0oK4dwRpn-miWXPj9eq2pN5xoRpA3_l8SvX2KiLC2oSLHa9mLVO8JFPnrNvLqpoyKXKwPlY3kzuo1pW_LU_MtKNqaMDaqv4jQIuMCVBXgJzOthU0iAZqaYd29ZX1T2AbI0R1MFtRDBDtjn9K9P1soMoM4lYjmzBWUIJgd7vg6f6AVYSTbNlJNQPKBR2qMIx_OukUTSAbFAvIobhWHeAMXTrwaRCMz33szsIvdFsR1-7qmOzMN" },
    { slug: "heritage-grinder", nameEn: "Heritage Grinder", descEn: "Handcrafted copper grinder inspired by traditional Egyptian artisanship.", price: "850.00", category: "accessories", rating: "4.7", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6dc5BR6VAl7cRiDRIVM4pSIIHTpg7b8RYXS20ztWO_P3OtC7qUGMd2V44NTMx0-P_m5nwIlykrzwYWJIXFu-4CrDblVg_UNuj1scSDJJwyOVnzCvlUUgLX8Ad01aQ9K6_ZWoj1jCsFNAjCc4XOyrsmkGQtlpJsGG4y4IzUMVGtUokfkDCfejKTmHyZ9dxKFbAdA-Qr4PtqIJCv6c3AmvKjwQY22Nsv4AoFIaZqNd38OjoNUguOpaUSsQQS19Ap0Bvg1gBqL-UzAFDw" },
    { slug: "egyptian-gold", nameEn: "Egyptian Gold", descEn: "A bold, full-bodied blend with notes of dark chocolate and toasted nuts.", price: "280.00", category: "beans", rating: "4.9", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzN0zQkS5k6B5_NdqcqnANAwA8Y4RujmzrSXJU2qOs0xAtV3EDM2Tf9LP8I7Jp0wV7ctqaTj5CB-dde9VsbPwyL-G9rrPab0Qi77-GVHdHSBrna-hUWNBuPucsdsFNJ_DlrDpEgx7F6xuOrFVN32rregDfUJgArLth4wZTH_GpF21o-5Ia3moH7M0pMGa0nkbSAphkneHNL_7TaiEMJdlJ6nczuibk6tjTg_gwwSYa2_gl3kz2EkMlaD6QmL7tARExqV9FhHuI2thQ" },
    { slug: "cold-brew-blend", nameEn: "Cold Brew Blend", descEn: "Specifically crafted for long cold steeping. Smooth, sweet and incredibly refreshing.", price: "195.00", category: "beans", rating: "4.6", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS_ICspq4E8s6psEzyun_WxdifdjFBoli9O5c9s65tenx-EJePiAHZ8apiZJNvUde2VHV7fWdc_ZiOqgesJjTGkF-VZ5fHhP3w5DcL_6hg2EdM4vb6opWU1nX5MuQY4QPhEpMP2t5cJwJFf2SPmjT8tVuTH285hiKDebeWo6gHn0o_n2QsAjnOAmKKpnI9CEC4PrlRPKhlfd4kjlF4uhvvXYcedrIkfnDKScVGCqfnqR0TNlLarQ_IgwPXD_AOJ2vEMbElf0Nd6DUY" },
    { slug: "modern-glass-set", nameEn: "Modern Glass Set", descEn: "Elegant double-walled glass cups that keep your espresso hot while staying cool to touch.", price: "450.00", category: "accessories", rating: "4.8", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiUxYdYPBdh0V9WNd34EKGHQKGAdMdwOK0b1nO8dC7w0xfwmwoHOnWnMl2D-0OZoPzUPVLSCIWOqLibvlcA2hDq3ApPszTDhICfJqwJAsU2M-CRsxlpltdXp4XDu1huzt55NEQH_wEtLSXoIrqUhuoKvdKG9gK9mJcs-g5wSMrNPAoVrI7sJSV7588q8jxmX42Tf3SWjxGdWWYEQABrPN0OxUDNxR5I754ANF9AMHcYVZbbFZKk9huvsEQnpVAUxYeZJL66mgF2mVu" },
    { slug: "cairo-roast", nameEn: "Cairo Roast", descEn: "Smoky, intense and deeply satisfying. The authentic taste of a Cairo evening.", price: "260.00", category: "beans", rating: "4.7", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ44YoDFCzS8xWko-C-YzrXd-o0wxnIxuPz-P_hqSda3BGfGGtL-6xry2vdVNByVllb2nsrww4TzcTmCHsNoiLxMi7o9Y8uB6184XU6TeOVaqOvMQYopWohq7zVA8n135XHAEfBTBjVYKndkSNl8xji6rALRinv0QNV7-VugHHsbqs-Ik_TqNrmLIOQFZwLSMeyRgUz6KggSbPexlP3Mcg1P9jNTdLC3EJqjssrYbdL34TFQA39EPUUrVgQH1u-seU444WJ5wvXjNP" },
  ];

  let productSort = 0;
  for (const p of productDefs) {
    // NOTE: seeded with the original Google-hosted placeholder images so the
    // storefront isn't empty on first run. Re-upload real product photos via
    // the dashboard Media Library — that stores them in MinIO like any other upload.
    const [mediaRow] = await db
      .insert(media)
      .values({
        disk: "external",
        bucket: "",
        objectKey: p.imageUrl,
        url: p.imageUrl,
        mime: "image/jpeg",
        alt: p.nameEn,
      })
      .$returningId();

    const [productRow] = await db
      .insert(storeProducts)
      .values({
        categoryId: storeCategoryIdBySlug.get(p.category)!,
        slug: p.slug,
        price: p.price,
        currency: "EGP",
        isBestSeller: p.isBestSeller ?? false,
        isFeaturedHome: p.isBestSeller ?? false,
        stockQty: 100,
        rating: p.rating,
        sortOrder: productSort++,
        isActive: true,
      })
      .$returningId();

    await db.insert(storeProductTranslations).values({
      productId: productRow.id,
      locale: "en",
      name: p.nameEn,
      description: p.descEn,
    });

    await db.insert(storeProductMedia).values({
      productId: productRow.id,
      mediaId: mediaRow.id,
      isPrimary: true,
      sortOrder: 0,
    });
  }

  console.log("\nSeed complete.");
  console.log(`Branch: ${branch.id} | Admin login: ${adminEmail} / ${adminPassword}`);
  console.log("Arabic translations were seeded for categories only — item/product Arabic text still needs to be filled in via the dashboard.");

  await connection.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
