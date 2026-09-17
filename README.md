# Offhome — Real Estate Portal

A React + Vite web app for buying, selling and renting homes, with a sidebar-only
navigation, a wood-and-cream light theme, a pitch-black dark theme, and a mocked
sign up → email verification → login flow.

## Run it locally

```bash
cd offhome
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production: `npm run build` (output goes to `dist/`).

## What's included

**Pages:** Home, Buy, Rent, Sell (list a property), Property Details, About,
Contact, Login, Register, Verify Email, Dashboard (protected), Profile
(protected), 404.

**Auth flow (mocked, no backend):** Register stores the account in
`localStorage`, generates a 6-digit code, and routes to `/verify-email`. Since
there's no real mail server, the demo screen shows the code directly in a
"Demo mode" badge so you can test the flow end to end. Logging in is blocked
until the email is verified. Dashboard and Profile are wrapped in a
`ProtectedRoute` that redirects to `/login` if there's no session.

**Sidebar-only navigation:** no top navbar — `Sidebar.jsx` holds all
navigation, the theme toggle, and the account/login area, and collapses into a
slide-out drawer on narrow screens.

**Theme toggle:** light mode uses a warm plaster-cream background with
saddle-brown ("wooden") buttons; dark mode drops the background to near-pure
black while keeping buttons in a brighter amber-wood tone and text in warm
off-white, so nothing disappears against the black. Toggled from the sidebar,
persisted to `localStorage`, and defaults to the system preference on first
visit.

**Logo:** a simple roofline mark (an "O" as the doorway) plus the "Offhome"
wordmark in Fraunces, used in the sidebar and as the favicon.

## Design notes

- **Colors:** cream `#F7F3EC` / wood `#8B5A2B` / forest accent `#2F4A3C` in
  light mode; pitch black `#050505` / amber-wood `#D48A4E` / soft green
  `#6FB196` in dark mode. Tokens live at the top of `src/index.css`.
- **Type:** Fraunces (serif, display) for headings, Inter (sans) for body and UI.
- **Data:** `src/data/properties.js` has sample listings — swap this for a real
  API or database when you're ready to go beyond the demo.

## Project structure

```
offhome/
├─ index.html
├─ public/favicon.svg
├─ src/
│  ├─ main.jsx, App.jsx, index.css
│  ├─ context/        (ThemeContext, AuthContext)
│  ├─ components/      (Sidebar, Logo, PropertyCard, ProtectedRoute)
│  ├─ pages/            (13 route pages)
│  └─ data/properties.js
```

## Where to take it next

- Swap the mock `localStorage` auth for a real backend (Firebase Auth, Supabase,
  or your own API) and a real transactional-email provider for verification codes.
- Connect `src/data/properties.js` to a real listings API or database, with image
  uploads for the Sell form.
- Add map-based search, saved-search alerts, and a favorites/wishlist that
  persists per account.
- Add pagination or infinite scroll to Buy/Rent once listings grow beyond a
  page or two.
- Add form validation feedback (inline, not just on submit) and loading/error
  states around any real network calls.
- Consider server-side rendering or static generation for the public pages
  (Home, Buy, Rent, property details) for SEO, since real estate search traffic
  is largely organic.
