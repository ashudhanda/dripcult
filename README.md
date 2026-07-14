# DRIPCULT — Streetwear Ecommerce Demo

Dark streetwear theme + light mode toggle. Pure HTML/CSS/JS — koi build step nahi.
GSAP + ScrollTrigger + Lenis CDN se load hote hai.

## 🚀 Kaise chalaye

1. Folder VS Code me kholo
2. **Live Server** extension se `index.html` run karo (ya bas double-click karke browser me kholo)
3. Done ✅

## 🖼️ Images kaise add kare (IMPORTANT)

Saari images `images/` folder me jayengi. **3:4 ratio (1080x1440), .jpg format.**

### Site images
| File | Kaha dikhti hai |
|---|---|
| `images/hero.jpg` | Homepage hero (model shot, portrait) |
| `images/lookbook.jpg` | "Don't Blend In" banner (wide/landscape best) |

### Product images — `images/products/` folder me
Har product ki 4 images, naming EXACT ye honi chahiye:

| Product | Files |
|---|---|
| 1. Urban Rebel Oversized Tee | `1-front.jpg`, `1-back.jpg`, `1-model-front.jpg`, `1-model-back.jpg` |
| 2. Stay Real Acid Wash Tee | `2-front.jpg`, `2-back.jpg`, `2-model-front.jpg`, `2-model-back.jpg` |
| 3. Tactical Olive Cargo Pants | `3-front.jpg` ... `3-model-back.jpg` |
| 4. Vintage Baggy Denim | `4-front.jpg` ... `4-model-back.jpg` |
| 5. Rust Wave Cuban Shirt | `5-front.jpg` ... `5-model-back.jpg` |
| 6. Summit Heavyweight Hoodie | `6-front.jpg` ... `6-model-back.jpg` |
| 7. Neon Retro Chunk Sneakers | `7-front.jpg` ... `7-model-back.jpg` |
| 8. Stealth Cargo Joggers | `8-front.jpg` ... `8-model-back.jpg` |

> Jab tak image nahi hai, site placeholder dikhayegi (broken nahi lagegi).

## ⚙️ Customize karna

- **WhatsApp number**: `js/main.js` me sabse upar `WHATSAPP_NUMBER` change karo (country code ke saath, bina `+` ke, e.g. `919876543210`)
- **Products/prices**: `js/products.js` me edit karo — naam, price, MRP, description, sizes
- **Brand name**: HTML files me `DRIPCULT` find & replace karo
- **Accent color**: `css/style.css` me `--accent: #c6f527` change karo

## 🌓 Theme toggle

Navbar me right side ☀️ / 🌙 button — dark ↔ light. User ki choice localStorage me save hoti hai.

## 📦 Features

- Fully mobile responsive (2-col grid, fullscreen menu, sticky add-to-cart bar)
- GSAP hero animation + scroll reveals + Lenis smooth scroll
- Cart (localStorage) + WhatsApp checkout
- Shop page filters (category-wise)
- Product page: 4-image gallery, size selector, WhatsApp order button
- Image missing ho toh graceful placeholder

## 🌐 Deploy (FREE)

1. GitHub pe repo banao, code push karo
2. [Netlify](https://netlify.com) / [Vercel](https://vercel.com) pe "Import from GitHub" — done
3. Ya GitHub Pages: repo Settings → Pages → branch select karo 
