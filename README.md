# My Hotel Booking — Frontend
React 18 · Tailwind CSS 3 · Stripe Checkout · Framer-Motion

A modern single-page application that lets travellers search, book and pay for hotel rooms.
It consumes the REST/JSON API served by **MyHotelBooking-Backend** and integrates Stripe Checkout for secure payments.

---

## ✨ Features
* **React Router v6** nested routes with `createBrowserRouter` for SPA navigation :contentReference[oaicite:0]{index=0}
* **Tailwind CSS** design tokens and custom colour palette (`brand`, `brand-secondary`) defined in `tailwind.config.js` :contentReference[oaicite:1]{index=1}
* **Framer-Motion** page-transition animations and micro-interactions :contentReference[oaicite:2]{index=2}
* **Stripe** client-side elements via `@stripe/react-stripe-js` for Checkout sessions :contentReference[oaicite:3]{index=3}
* **Font Awesome 6** icon packs (`solid`, `regular`) through the official React wrapper :contentReference[oaicite:4]{index=4}
* **Recharts**, **react-date-range**, **react-select**, **Yup** and friends for dashboards, date pickers, forms & validation :contentReference[oaicite:5]{index=5}
* Strict lint/format rules via **ESLint 8** & **Prettier 3** with git pre-commit hooks (`lint-staged`) :contentReference[oaicite:6]{index=6}

---

## 🛠  Requirements
| Tool | Recommended version |
|------|---------------------|
| Node.js | **≥ 18 LTS** (works fine with 20) |
| npm / yarn | npm 10 or Yarn 3 |
| A running backend | default: `http://localhost:8887` :contentReference[oaicite:7]{index=7} |

---

## 🚀 Quick start
```bash
git clone https://github.com/CodideFaria/MyHotelBooking-Frontend.git
cd MyHotelBooking-Frontend

npm install           # installs deps exactly as in package-lock.json
npm start             # launches dev-server on http://localhost:3000
```
