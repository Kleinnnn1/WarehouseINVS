import { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import { supabase } from "../service/supabaseClient";

function ScannerModal({ onClose }) {
    const [qrResult, setQrResult] = useState(null);
    const [itemData, setItemData] = useState(null);
    const [useCamera, setUseCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

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

    useEffect(() => {
        let interval;
        if (useCamera) {
            navigator.mediaDevices
                .getUserMedia({ video: { facingMode: "environment" } })
                .then((stream) => {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }

                    interval = setInterval(() => {
                        if (canvasRef.current && videoRef.current) {
                            const ctx = canvasRef.current.getContext("2d");
                            canvasRef.current.width = videoRef.current.videoWidth;
                            canvasRef.current.height = videoRef.current.videoHeight;
                            ctx.drawImage(videoRef.current, 0, 0);
                            const imageData = ctx.getImageData(
                                0,
                                0,
                                canvasRef.current.width,
                                canvasRef.current.height
                            );
                            const code = jsQR(imageData.data, imageData.width, imageData.height);
                            if (code) {
                                setQrResult(code.data);
                                fetchItemByQR(code.data);
                                setUseCamera(false); // stop scanning
                            }
                        }
                    }, 500);
                })
                .catch((err) => {
                    alert("Unable to access camera");
                    console.error(err);
                });
        }

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            clearInterval(interval);
        };
    }, [useCamera]);

    return (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-lg border-2 border-pink-400">
                <h2 className="text-2xl font-bold text-pink-600 mb-4">Scanner</h2>

                <div className="space-y-4 text-center text-pink-800">
                    {/* Upload */}
                    <label className="block underline cursor-pointer hover:text-pink-900">
                        Upload QR Code Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>

                    {/* OR camera */}
                    <button
                        onClick={() => {
                            setItemData(null);
                            setQrResult(null);
                            setUseCamera(true);
                        }}
                        className="mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                    >
                        Use Camera
                    </button>

                    {useCamera && (
                        <div className="mt-4">
                            <video ref={videoRef} className="w-full rounded" />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    )}

                    {itemData && (
                        <div className="mt-4 text-left text-sm">
                            <p><strong>Name:</strong> {itemData.name}</p>
                            <p><strong>Stock:</strong> {itemData.stock}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        setUseCamera(false);
                        onClose();
                    }}
                    className="mt-6 w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default ScannerModal;
