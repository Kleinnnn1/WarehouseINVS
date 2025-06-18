import { useState } from "react";

function AddStockModal({ isOpen, onClose, onSubmit, item }) {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm border-2 border-green-600">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Add Stock: {item.name}</h2>
                <label className="block text-green-800 mb-2">Quantity to Add</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    min="1"
                    className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSubmit(quantity);
                            setQuantity(1); // Reset for next use
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddStockModal;
