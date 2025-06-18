import { useState, useEffect } from "react";
import { supabase } from "../service/supabaseClient";

function EditItemModal({ isOpen, onClose, onSave, item }) {
    const [formData, setFormData] = useState({
        itemName: "",
        stock: "",
        qrCode: "",
    });

    useEffect(() => {
        if (item) {
            setFormData({
                itemName: item.name || "",
                stock: item.stock || 0,
                qrCode: item.qr_url || "", // Ensure correct field mapping
            });
        }
    }, [item]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...item,
            name: formData.itemName,
            stock: parseInt(formData.stock),
        });
        onClose();
    };

    const handleDelete = async () => {
        if (!item || !item.id) return;

        const confirm = window.confirm(`Are you sure you want to delete "${item.name}"?`);
        if (!confirm) return;

        const { error } = await supabase
            .from("items")
            .delete()
            .eq("id", item.id);

        if (error) {
            console.error("Delete failed:", error.message);
            alert("Failed to delete item.");
        } else {
            alert("Item deleted successfully.");
            onClose(); // Close the modal
            // Optionally trigger parent refresh
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Edit Item</h2>
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
                        <label className="block text-green-800 font-medium mb-1">QR Code</label>
                        <input
                            type="text"
                            name="qrCode"
                            value={formData.qrCode}
                            disabled
                            className="w-full border border-green-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
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
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditItemModal;
