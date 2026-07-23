# FurniFullStack — one project: React frontend + ASP.NET API + Swagger

This is the corrected setup: **one Visual Studio project**. Press F5 on
`FurniAPI.sln` and you get the real website (built from React, using your
**original Furni template's actual CSS/markup** — not a redesign), the API,
and Swagger, all from the same URL.

```
https://localhost:5001/          → the website (built React app)
https://localhost:5001/api/...   → the API
https://localhost:5001/swagger   → Swagger, for testing endpoints directly
```

## What changed from the version before this

1. **The frontend now uses your actual template** — the same
   `bootstrap.min.css`, `style.css`, `tiny-slider.css/js`, and images from
   your original `FurniWebApplication/wwwroot`, copied in as-is. Every page
   (Home, Shop, Cart, Checkout, Order Confirmation, About, Services,
   Contact, Blog) is rebuilt in React using the **same markup and CSS
   classes** as your original `.cshtml` views, just with real data wired in
   instead of Razor's `@foreach` loops. The Admin panel matches your
   `Areas/Admin` dashboard's dark sidebar theme the same way.
2. **One project, not two.** `frontend/` is the React source. Running
   `npm run build` inside it writes directly into `FurniAPI/wwwroot` (see
   `frontend/vite.config.js` — that's the one setting that makes this
   work: `build.outDir: '../FurniAPI/wwwroot'`). ASP.NET then serves that
   as the website, right alongside the API and Swagger.

## Project structure

```
FurniFullStack/
├── FurniAPI.sln
├── FurniAPI/                       ← ASP.NET Core Web API (unchanged backend logic)
│   ├── Controllers/, Models/, DTOs/, Data/, Program.cs
│   └── wwwroot/                     ← the built website lands here after `npm run build`
│       ├── index.html, assets/*      (built by Vite)
│       ├── css/, js/, images/*        (your original template's real files)
│       └── images/products/            (uploaded product photos - untouched by builds)
└── frontend/                       ← React source (edit this, not wwwroot directly)
    ├── vite.config.js                ← outDir points at ../FurniAPI/wwwroot
    ├── .env.development               ← used by `npm run dev` (hot reload, separate port)
    ├── .env.production                ← used by `npm run build` (same-origin, merged)
    └── src/
        ├── pages/          Home, Shop, Cart, Checkout, OrderConfirmation, Orders,
        │                    Login, Register, About, Contact, Services, Blog, Privacy
        ├── pages/admin/    Dashboard, Products, Coupons, Orders, Users, AdminLayout
        ├── components/     Navbar, Footer, ProductItem, TestimonialSection, RouteGuards, UI
        ├── context/        AuthContext (JWT/login state), CartContext
        ├── api/            client.js (fetch wrapper), endpoints.js (one fn per API call)
        └── styles/index.css   only the handful of things not already in style.css
```

## Two ways to work on this, day to day

### A) Fast iteration while building the frontend (recommended while coding)

```bash
cd FurniAPI      # first terminal: run the backend
# F5 in Visual Studio, or: dotnet run

cd frontend      # second terminal: run the frontend with hot reload
npm install       # first time only
npm run dev
```
Open `http://localhost:5173`. Every edit to a `.jsx` file appears instantly.
This mode talks to the API on `localhost:5001` across two ports, which is
why CORS is still configured in `Program.cs` — needed for this mode only.

### B) The actual "one project" deliverable (what your mentor asked for)

```bash
cd frontend
npm install       # first time only
npm run build
```
This writes the finished site straight into `FurniAPI/wwwroot`. Now just:

- Open `FurniAPI.sln` in Visual Studio
- Press F5
- `https://localhost:5001/` **is the website** — Home, Shop, Cart, Checkout,
  Admin, all of it, in one running project. Swagger is still at `/swagger`.

**Do this build step once after you're done making frontend changes** — it's
the equivalent of "compiling" the frontend, same idea as building the C#
project. You don't need to rebuild every time you just restart FurniAPI;
only when the React source actually changed.

## Faithfulness notes (what matches your original exactly, and what's new)

- **Visual design**: identical — same Bootstrap template files, same class
  names (`hero`, `product-item`, `site-blocks-table`, `btn-black`, etc.),
  same testimonial slider library (`tiny-slider.js`), same admin dark
  sidebar. Nothing was redesigned.
- **Product click behavior**: matches your original exactly — clicking a
  product card on Home/Shop adds it straight to the cart (your original
  template never had a separate product-detail page either).
- **What's necessarily different**: login/session works via JWT instead of
  cookies (explained in earlier messages), and the coupon code is tracked in
  the browser instead of server-side Session, since a stateless API has no
  session to store it in. Everything else — layout, styling, page flow —
  mirrors your original site.
- **Contact form**: your original posted to `HomeController.Contact` with no
  persistence beyond a one-time success message — this version shows the
  same kind of success message client-side, since there's no dedicated
  "contact" table/endpoint in the API (let me know if you want one added).

## If something doesn't look right

- **Blank page / 404 at `https://localhost:5001/`** → you haven't run
  `npm run build` yet, so `wwwroot` has no `index.html`. Run it once (see
  Option B above).
- **Old version still showing after a rebuild** → hard-refresh
  (Ctrl+Shift+R) — the browser may have cached the previous `assets/*.js`.
- **Refreshing `/shop` or `/cart` directly gives a blank page** → confirm
  `Program.cs` still has `app.MapFallbackToFile("index.html")` after
  `app.MapControllers()` — that line is what lets React Router handle those
  URLs on a hard refresh.
