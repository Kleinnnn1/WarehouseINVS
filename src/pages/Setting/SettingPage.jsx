import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../../assets/images/background.jpg";

function SettingPage() {
    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Replace this with actual password validation and update logic
        setMessage("Changes saved successfully!");
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="bg-white/90 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-green-700">Account Settings</h1>
                </div>

                {message && (
                    <div className="mb-4 text-green-600 font-medium">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">
                            Change Username
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter new username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">
                            Old Password
                        </label>
                        <input
                            type="password"
                            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter old password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SettingPage;
