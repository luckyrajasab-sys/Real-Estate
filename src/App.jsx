import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Buy from "./pages/Buy.jsx";
import Rent from "./pages/Rent.jsx";
import Lease from "./pages/Lease.jsx";
import LiveOffers from "./pages/LiveOffers.jsx";
import Sell from "./pages/Sell.jsx";
import PropertyDetails from "./pages/PropertyDetails.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="app-shell-topnav">
      <Navbar />
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/lease" element={<Lease />} />
          <Route path="/live-offers" element={<LiveOffers />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Luxury Footer */}
      <footer className="luxury-site-footer">
        <div className="footer-top-grid">
          <div className="footer-col brand-col">
            <div className="footer-brand-title">OFFHOME PRIME</div>
            <p className="footer-brand-tagline">
              Connecting high-net-worth individuals, institutional investors, and discerning residents with premier real
              estate worldwide.
            </p>
            <div className="footer-market-tags">
              <span>New York</span> • <span>London</span> • <span>Dubai</span> • <span>Tokyo</span> • <span>Paris</span> • <span>Singapore</span> • <span>Sydney</span> • <span>Mumbai</span>
            </div>
          </div>
          <div className="footer-col">
            <h4>Transactions</h4>
            <ul>
              <li><a href="/buy">Buy Property</a></li>
              <li><a href="/rent">Rent Homes & Apartments</a></li>
              <li><a href="/lease">Long-term Leases</a></li>
              <li><a href="/live-offers">Live Flash Slots ⚡</a></li>
              <li><a href="/sell">List Your Property</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Global Portfolios</h4>
            <ul>
              <li><a href="/buy?propertyType=Villa">Luxury Villas</a></li>
              <li><a href="/buy?propertyType=Penthouse">Sky Penthouses</a></li>
              <li><a href="/buy?propertyType=2BHK">2BHK Residences</a></li>
              <li><a href="/buy?propertyType=3BHK">3BHK Family Suites</a></li>
              <li><a href="/buy?propertyType=4BHK%2B">4BHK+ Waterfronts</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Concierge & Trust</h4>
            <ul>
              <li><a href="/about">About Offhome</a></li>
              <li><a href="/contact">Private Client Office</a></li>
              <li><a href="/dashboard">Transaction Desk</a></li>
              <li><a href="/login">Global Client Login</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <div>© {new Date().getFullYear()} Offhome Prime Worldwide Ltd. All Rights Reserved.</div>
          <div className="footer-legal-links">
            <span>Verified Escrow Protection</span> • <span>Strict Non-Disclosure</span> • <span>Global Real Estate MLS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

