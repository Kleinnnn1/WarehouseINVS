import { useState } from "react";
import logo from "../assets/images/mainLogo.png"; // Local logo

function LoginModal({ isOpen, onClose, onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        setError(null);
        if (onLogin) onLogin({ email, password });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 border-2 border-green-600">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-25 h-25"
                    />
                </div>

                <h2 className="text-2xl font-bold text-green-700 text-center mb-6">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-green-800 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-green-800 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-between items-center mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;
