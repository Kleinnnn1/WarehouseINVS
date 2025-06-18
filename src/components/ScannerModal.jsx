function ScannerModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-lg border-2 border-pink-400">
                <h2 className="text-2xl font-bold text-pink-600 mb-4">Scanner</h2>

                <div className="bg-pink-100 border-l-4 border-pink-500 p-4 rounded-md text-pink-800 shadow-sm text-center">
                    <p className="text-lg">[ Scanner Preview / Instruction Placeholder ]</p>
                    <p className="text-sm mt-2 text-pink-700">
                        Use your device camera to scan a QR code or{" "}
                        <span className="underline font-bold">Upload QR Image</span>.
                    </p>
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
