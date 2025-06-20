import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../service/supabaseClient";
import background from "../../assets/images/background.jpg";
import Swal from "sweetalert2";

function SettingPage() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSession = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData?.session?.user;

            if (user?.email) {
                setEmail(user.email);
            }
        };

        fetchSession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (!user) {
            Swal.fire("Not Authenticated", "You are not logged in.", "error");
            return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: oldPassword,
        });

        if (signInError) {
            Swal.fire("Incorrect Password", "The old password is incorrect.", "error");
            return;
        }

        if (newPassword) {
            const { error: passError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (passError) {
                Swal.fire("Password Update Failed", passError.message, "error");
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Password changed successfully!",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/Stocks"); // 🔁 Redirect after SweetAlert closes
                });

                setOldPassword("");
                setNewPassword("");
            }
        } else {
            Swal.fire("Missing Input", "Please enter a new password.", "warning");
        }
    };


    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="bg-white/90 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm">
                <h1 className="text-2xl font-bold text-green-700 mb-4">Change Password</h1>
                {email && (
                    <p className="text-green-800 font-medium mb-4">
                        Changing password for <span className="font-semibold">{email}</span>
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                            required
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
                            required
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
