import { useState, useEffect } from "react";
import {
  FaWarehouse,
  FaBoxes,
  FaUserShield,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import LoginModal from "../../components/LoginModal";
import background from "../../assets/images/background.jpg";

const features = [
  {
    icon: <MdInventory className="text-6xl text-green-600 mb-4" />,
    title: "Real-Time Inventory",
    description: "Track every item and change in stock with live updates.",
  },
  {
    icon: <FaBoxes className="text-6xl text-green-600 mb-4" />,
    title: "QR Code Support",
    description: "Scan or generate QR codes to quickly identify items.",
  },
  {
    icon: <FaUserShield className="text-6xl text-green-600 mb-4" />,
    title: "User Roles",
    description: "Manage system access through secure role-based login.",
  },
];

function LandingPage() {
  const [current, setCurrent] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => setCurrent((prev) => (prev + 1) % features.length);
  const goToPrev = () => setCurrent((prev) => (prev - 1 + features.length) % features.length);

  const { icon, title, description } = features[current];

  return (
    <div className="min-h-screen flex flex-col bg-white text-green-800">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-green-600 text-white shadow-md relative">
        <div className="flex items-center gap-2 text-xl font-bold">
          <FaWarehouse />
          <span>Warehouse INVS</span>
        </div>

        {/* Desktop Nav */}
        <nav className="space-x-4 text-sm font-medium hidden sm:flex">
          <button className="hover:text-green-200">Home</button>
          <button onClick={() => setShowLogin(true)} className="hover:text-green-200">
            Inventory
          </button>
          <button onClick={() => setShowLogin(true)} className="hover:text-green-200">
            Login
          </button>
        </nav>

        {/* Mobile Burger Icon */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {menuOpen && (
          <div className="absolute top-full right-0 w-40 bg-green-700 text-white flex flex-col rounded-b shadow-lg sm:hidden z-10">
            <button className="px-4 py-3 text-left hover:bg-green-600" onClick={() => setMenuOpen(false)}>Home</button>
            <button className="px-4 py-3 text-left hover:bg-green-600" onClick={() => { setMenuOpen(false); setShowLogin(true); }}>Inventory</button>
            <button className="px-4 py-3 text-left hover:bg-green-600" onClick={() => { setMenuOpen(false); setShowLogin(true); }}>Login</button>
          </div>
        )}
      </header>

      {/* Main Section */}
      <main
        className="flex flex-col-reverse md:flex-row flex-grow items-center justify-center px-6 py-10 gap-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-green-700">
            Smart Warehouse Inventory
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            Keep track of your stocks, logs, and QR-coded items in one place — accurate, simple, powerful.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-green-600 text-white px-6 py-3 text-lg rounded-md hover:bg-green-700 transition"
          >
            Get Started
          </button>
        </div>

        {/* Feature Carousel */}
        <div className="relative w-full sm:max-w-md text-center bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-green-200">
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800"
          >
            <FaChevronRight size={20} />
          </button>

          <div className="flex justify-center">{icon}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">{title}</h2>
          <p className="text-sm sm:text-md text-gray-700">{description}</p>

          <div className="flex justify-center gap-2 mt-5">
            {features.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index ? "bg-green-600" : "bg-green-200"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 text-white text-center py-3 text-sm">
        © 2025 Warehouse INVS. All rights reserved.
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={(credentials) => {
          console.log("Logging in with", credentials);
          setShowLogin(false);
        }}
      />
    </div>
  );
}

export default LandingPage;
