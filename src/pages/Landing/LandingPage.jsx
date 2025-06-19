import { useState, useEffect } from "react";
import { FaWarehouse, FaBoxes, FaUserShield, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdInventory } from "react-icons/md";

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
        description: "Control access with requestor, admin, and department views.",
    },
];

function LandingPage() {
    const [current, setCurrent] = useState(0);

    // Auto-slide with faster transition
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % features.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const goToNext = () => setCurrent((current + 1) % features.length);
    const goToPrev = () => setCurrent((current - 1 + features.length) % features.length);

    const { icon, title, description } = features[current];

    return (
        <div className="h-screen bg-white text-green-800 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-4 shadow-md bg-green-600 text-white">
                <div className="flex items-center gap-2 text-2xl font-bold">
                    <FaWarehouse />
                    <span>Warehouse INVS</span>
                </div>
                <nav className="space-x-4 text-sm font-medium">
                    <a href="#" className="hover:text-green-200">Home</a>
                    <a href="#" className="hover:text-green-200">Inventory</a>
                    <a href="#" className="hover:text-green-200">Login</a>
                </nav>
            </header>

            {/* Hero + Carousel Features */}
            <main className="flex-grow flex flex-col md:flex-row items-center justify-between px-8 py-10 bg-green-50 gap-10">
                <div className="max-w-xl">
                    <h1 className="text-5xl font-extrabold mb-4 text-green-700">
                        Smart Warehouse Inventory
                    </h1>
                    <p className="text-xl text-green-800 mb-6">
                        Keep track of your stocks, logs, and QR-coded items in one place — accurate, simple, powerful.
                    </p>
                    <button className="bg-green-600 text-white px-6 py-3 text-lg rounded-md hover:bg-green-700 transition">
                        Get Started
                    </button>
                </div>

                {/* Feature Carousel Card */}
                <div className="relative w-full md:w-[40%] text-center bg-white p-8 rounded-xl shadow-lg border border-green-200 transition-all duration-300">
                    {/* Arrow Buttons */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                    >
                        <FaChevronLeft size={24} />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                    >
                        <FaChevronRight size={24} />
                    </button>

                    <div className="flex justify-center">{icon}</div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">{title}</h2>
                    <p className="text-md text-gray-700">{description}</p>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
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
                © 2025 Warehouse Inventory System. All rights reserved.
            </footer>
        </div>
    );
}

export default LandingPage;
