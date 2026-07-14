// ============================================
// DRIPCULT — Product Data
// Yaha apne products add/edit karo.
// images array = images/products/ folder ke filenames (bina .jpg ke)
// Har product ki 4 images: front, back, model-front, model-back
// ============================================

const PRODUCTS = [
  {
    id: 1,
    name: "Urban Rebel Oversized Tee",
    category: "tshirts",
    price: 799,
    mrp: 1299,
    tag: "Bestseller",
    desc: "240 GSM heavyweight cotton. Drop shoulders, boxy fit. Bold 'URBAN DISRUPTION' chest print. Made to stand out.",
    images: ["1-front", "1-back", "1-model-front", "1-model-back"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 2,
    name: "Stay Real Acid Wash Tee",
    category: "tshirts",
    price: 899,
    mrp: 1499,
    tag: "New Drop",
    desc: "Vintage acid-wash charcoal tee with skeleton rose back print. Every wash pattern is unique — just like you.",
    images: ["2-front", "2-back", "2-model-front", "2-model-back"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 3,
    name: "Tactical Olive Cargo Pants",
    category: "bottoms",
    price: 1299,
    mrp: 2199,
    tag: "Trending",
    desc: "Slim-thigh, tapered-ankle cargos in cotton twill. 6 pockets, snap-flap thighs, drawstring cuffs. Utility done right.",
    images: ["3-front", "3-back", "3-model-front", "3-model-back"],
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 4,
    name: "Vintage Baggy Denim",
    category: "bottoms",
    price: 1499,
    mrp: 2499,
    tag: "Bestseller",
    desc: "Light blue baggy straight-leg jeans with vintage thigh fading. Stacks perfectly over sneakers.",
    images: ["4-front", "4-back", "4-model-front", "4-model-back"],
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 5,
    name: "Rust Wave Cuban Shirt",
    category: "shirts",
    price: 999,
    mrp: 1699,
    tag: "New Drop",
    desc: "Oversized cuban collar shirt in rust orange viscose with abstract line print. Breathable, boxy, effortless.",
    images: ["5-front", "5-back", "5-model-front", "5-model-back"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 6,
    name: "Summit Heavyweight Hoodie",
    category: "hoodies",
    price: 1599,
    mrp: 2799,
    tag: "Premium",
    desc: "450 GSM fleece. Double-layer hood, embroidered mountain logo. The heaviest hoodie you'll ever own.",
    images: ["6-front", "6-back", "6-model-front", "6-model-back"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 7,
    name: "Neon Retro Chunk Sneakers",
    category: "footwear",
    price: 2499,
    mrp: 4299,
    tag: "Hot",
    desc: "Chunky retro low-tops. White leather, grey suede panels, neon green heel hits. Built for the streets.",
    images: ["7-front", "7-back", "7-model-front", "7-model-back"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]
  },
  {
    id: 8,
    name: "Stealth Cargo Joggers",
    category: "bottoms",
    price: 1199,
    mrp: 1999,
    tag: "Trending",
    desc: "Black stretch-cotton joggers with zippered thigh pockets and ribbed cuffs. All-black everything.",
    images: ["8-front", "8-back", "8-model-front", "8-model-back"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  }
];
