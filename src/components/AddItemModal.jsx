import { useState } from "react";
import { supabase } from "../service/supabaseClient"

function AddItemModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        itemName: "",
        stock: "",
        price: "",
        qrCode: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newItem = {
            name: formData.itemName,
            stock: parseInt(formData.stock),
            price: formData.price ? parseFloat(formData.price) : null,
            qr_url: formData.qrCode || null,
            threshold: 0,
        };

        const { data, error } = await supabase
            .from("items")
            .insert([newItem])
            .select(); // ⬅️ Make sure to use `.select()` to return the inserted data

        if (error || !data || data.length === 0) {
            console.error("Failed to insert item:", error?.message || "No data returned");
            alert("Failed to save item. Check the console for details.");
            return;
        }

        if (onSave) onSave(data[0]);

        setFormData({ itemName: "", stock: "", price: "", qrCode: "" });
        onClose();

        setTimeout(() => {
            alert("Item added successfully!");
        }, 100);
    };




    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Add New Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-green-800 font-medium mb-1">Item Name</label>
                        <input
                            type="text"
                            name="itemName"
                            onChange={handleChange}
                            value={formData.itemName}
                            className="w-full border border-green-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-green-800 font-medium mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            onChange={handleChange}
                            value={formData.stock}
                            className="w-full border border-green-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-green-800 font-medium mb-1">Price</label>
                        <input
                            type="text"
                            name="price"
                            onChange={handleChange}
                            value={formData.price}
                            className="w-full border border-green-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-green-800 font-medium mb-1">QR Code</label>
                        <input
                            type="text"
                            name="qrCode"
                            onChange={handleChange}
                            value={formData.qrCode}
                            className="w-full border border-green-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddItemModal;
