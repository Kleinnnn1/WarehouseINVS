import { useState } from "react";
import jsQR from "jsqr";
import { supabase } from "../service/supabaseClient";

function ScannerModal({ onClose }) {
    const [qrResult, setQrResult] = useState(null);
    const [itemData, setItemData] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                setQrResult(code.data);
                fetchItemByQR(code.data);
            } else {
                alert("QR code not detected. Try a clearer image.");
                setItemData(null);
            }
        };
    };

    const fetchItemByQR = async (qrValue) => {
        const { data, error } = await supabase
            .from("items")
            .select("*")
            .or(`name.eq.${qrValue},qr_url.eq.${qrValue}`);

        if (error) {
            console.error("Fetch error:", error);
            alert("Error retrieving item.");
            return;
        }

        if (data.length > 0) {
            setItemData(data[0]);
        } else {
            setItemData(null);
            alert("No matching item found.");
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-lg border-2 border-pink-400">
                <h2 className="text-2xl font-bold text-pink-600 mb-4">Scanner</h2>

                <div className="bg-pink-100 border-l-4 border-pink-500 p-4 rounded-md text-pink-800 shadow-sm text-center">
                    <label className="mt-4 inline-block underline text-pink-700 cursor-pointer text-lg hover:text-pink-900">
                        Upload QR Code Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>



                    {itemData && (
                        <div className="mt-4 text-left">
                            <p><strong>Name:</strong> {itemData.name}</p>
                            <p><strong>Stock:</strong> {itemData.stock}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default ScannerModal;
