import { useState } from "react";
import background from "../../assets/images/background.jpg";
import { registerUser } from "../../service/StocksApi"; // ✅ API function

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await registerUser({ email, password });
            setMessage("Registration successful! Check your email to confirm.");
            setEmail("");
            setPassword("");
        } catch (err) {
            setError(err.message || "Registration failed.");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
                <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
                    Create Account
                </h2>

                {message && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm font-medium">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter a secure password"
                            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition font-semibold"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-green-600 font-medium hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
