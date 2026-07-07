export interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  tag: string;
  badge?: string;
  image: string;
  alt: string;
  category: "beans" | "turkish" | "espresso" | "accessories" | "gifts";
  description?: string;
}

export const products: Product[] = [
  {
    id: "afandi-signature",
    name: "Afandi Signature Blend",
    price: "EGP 245",
    rating: 4.9,
    tag: "Medium Roast",
    badge: "Bestseller",
    category: "beans",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO3qDKQXh0zthabZhGghK70edShq3haEB1h7sRkctfUAUvCktpsQhD3od5976WV88c4RPNCIDUVXOiNGXtpupKNllLKdSxlA8U9NOZFVfGgfmrAubD3XVJx_WSeVw0oYszK-zZf8iJchMGQbziszcEzDxqeQ_hZKNQHlKu47tQPUFCAtCW0LkteupjF2PbRAvQSZPaP-4GP9ycLWUchY0LnUTMvXfNBq2s9LydUn-dzpdGPRA3yhlkMsZqL5rVMHl8aGGfdsUrcS22",
    alt: "Afandi Signature Blend coffee bag",
    description: "Our flagship blend combining Ethiopian and Brazilian origins for a balanced, complex cup.",
  },
  {
    id: "classic-espresso",
    name: "Classic Espresso",
    price: "EGP 220",
    rating: 4.8,
    tag: "Fine Grind",
    category: "espresso",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEcBBEWYoqKB1g9SMRo-PBOPa4ygrijePGjVQHlqBLsct3adHO8IXO36ofvFEDaYptN7N_nUVhsv9dIOJZkUagHWR4OR3zJLKQBJE-tZfVIkVAHo3W6c3ufPAdFDUDOTiErcfancpKo0w_oQ_JaY_RZ7LuItoW1_l8uF2j4U6p5BO1Nl1GEPHhoRpLr0eUY-w_vBt5gVlLzFmeUixkO0jQh8-url9VXwC2ivbJxKe-oeCPcnfgvTAph2dfF3TEUloq7XEpwtU33MXX",
    alt: "Classic Espresso Turkish coffee tin",
    description: "Dark, rich and intensely aromatic. Perfect for those who love a strong, traditional cup.",
  },
  {
    id: "ethiopian-yirgacheffe",
    name: "Ethiopian Yirgacheffe",
    price: "EGP 310",
    rating: 5.0,
    tag: "Light Roast",
    category: "beans",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCualFC7dUe4fOId29Fhv_WOObJt0A0oK4dwRpn-miWXPj9eq2pN5xoRpA3_l8SvX2KiLC2oSLHa9mLVO8JFPnrNvLqpoyKXKwPlY3kzuo1pW_LU_MtKNqaMDaqv4jQIuMCVBXgJzOthU0iAZqaYd29ZX1T2AbI0R1MFtRDBDtjn9K9P1soMoM4lYjmzBWUIJgd7vg6f6AVYSTbNlJNQPKBR2qMIx_OukUTSAbFAvIobhWHeAMXTrwaRCMz33szsIvdFsR1-7qmOzMN",
    alt: "Ethiopian Yirgacheffe single-origin beans",
    description: "Bright floral notes with a sparkling citrus acidity. Our most awarded single-origin.",
  },
  {
    id: "heritage-grinder",
    name: "Heritage Grinder",
    price: "EGP 850",
    rating: 4.7,
    tag: "Limited Edition",
    category: "accessories",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6dc5BR6VAl7cRiDRIVM4pSIIHTpg7b8RYXS20ztWO_P3OtC7qUGMd2V44NTMx0-P_m5nwIlykrzwYWJIXFu-4CrDblVg_UNuj1scSDJJwyOVnzCvlUUgLX8Ad01aQ9K6_ZWoj1jCsFNAjCc4XOyrsmkGQtlpJsGG4y4IzUMVGtUokfkDCfejKTmHyZ9dxKFbAdA-Qr4PtqIJCv6c3AmvKjwQY22Nsv4AoFIaZqNd38OjoNUguOpaUSsQQS19Ap0Bvg1gBqL-UzAFDw",
    alt: "Heritage copper coffee grinder",
    description: "Handcrafted copper grinder inspired by traditional Egyptian artisanship.",
  },
  {
    id: "egyptian-gold",
    name: "Egyptian Gold",
    price: "EGP 280",
    rating: 4.9,
    tag: "Medium-Dark Roast",
    category: "beans",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzN0zQkS5k6B5_NdqcqnANAwA8Y4RujmzrSXJU2qOs0xAtV3EDM2Tf9LP8I7Jp0wV7ctqaTj5CB-dde9VsbPwyL-G9rrPab0Qi77-GVHdHSBrna-hUWNBuPucsdsFNJ_DlrDpEgx7F6xuOrFVN32rregDfUJgArLth4wZTH_GpF21o-5Ia3moH7M0pMGa0nkbSAphkneHNL_7TaiEMJdlJ6nczuibk6tjTg_gwwSYa2_gl3kz2EkMlaD6QmL7tARExqV9FhHuI2thQ",
    alt: "Egyptian Gold coffee",
    description: "A bold, full-bodied blend with notes of dark chocolate and toasted nuts.",
  },
  {
    id: "cold-brew-blend",
    name: "Cold Brew Blend",
    price: "EGP 195",
    rating: 4.6,
    tag: "Coarse Grind",
    category: "beans",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS_ICspq4E8s6psEzyun_WxdifdjFBoli9O5c9s65tenx-EJePiAHZ8apiZJNvUde2VHV7fWdc_ZiOqgesJjTGkF-VZ5fHhP3w5DcL_6hg2EdM4vb6opWU1nX5MuQY4QPhEpMP2t5cJwJFf2SPmjT8tVuTH285hiKDebeWo6gHn0o_n2QsAjnOAmKKpnI9CEC4PrlRPKhlfd4kjlF4uhvvXYcedrIkfnDKScVGCqfnqR0TNlLarQ_IgwPXD_AOJ2vEMbElf0Nd6DUY",
    alt: "Cold Brew Blend",
    description: "Specifically crafted for long cold steeping. Smooth, sweet and incredibly refreshing.",
  },
  {
    id: "modern-glass-set",
    name: "Modern Glass Set",
    price: "EGP 450",
    rating: 4.8,
    tag: "Accessories",
    category: "accessories",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiUxYdYPBdh0V9WNd34EKGHQKGAdMdwOK0b1nO8dC7w0xfwmwoHOnWnMl2D-0OZoPzUPVLSCIWOqLibvlcA2hDq3ApPszTDhICfJqwJAsU2M-CRsxlpltdXp4XDu1huzt55NEQH_wEtLSXoIrqUhuoKvdKG9gK9mJcs-g5wSMrNPAoVrI7sJSV7588q8jxmX42Tf3SWjxGdWWYEQABrPN0OxUDNxR5I754ANF9AMHcYVZbbFZKk9huvsEQnpVAUxYeZJL66mgF2mVu",
    alt: "Modern double-walled glass espresso set",
    description: "Elegant double-walled glass cups that keep your espresso hot while staying cool to touch.",
  },
  {
    id: "cairo-roast",
    name: "Cairo Roast",
    price: "EGP 260",
    rating: 4.7,
    tag: "Dark Roast",
    category: "beans",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ44YoDFCzS8xWko-C-YzrXd-o0wxnIxuPz-P_hqSda3BGfGGtL-6xry2vdVNByVllb2nsrww4TzcTmCHsNoiLxMi7o9Y8uB6184XU6TeOVaqOvMQYopWohq7zVA8n135XHAEfBTBjVYKndkSNl8xji6rALRinv0QNV7-VugHHsbqs-Ik_TqNrmLIOQFZwLSMeyRgUz6KggSbPexlP3Mcg1P9jNTdLC3EJqjssrYbdL34TFQA39EPUUrVgQH1u-seU444WJ5wvXjNP",
    alt: "Cairo Roast dark espresso",
    description: "Smoky, intense and deeply satisfying. The authentic taste of a Cairo evening.",
  },
];
