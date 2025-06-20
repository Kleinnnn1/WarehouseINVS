import { useState, useEffect } from "react";
import { supabase } from "../service/supabaseClient";
import Swal from "sweetalert2";

function EditItemModal({ isOpen, onClose, onSave, onDelete, item }) {
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

        const result = await Swal.fire({
            title: `Delete "${item.name}"?`,
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        const { error } = await supabase.from("items").delete().eq("id", item.id);

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: error.message,
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Item deleted successfully.",
                timer: 2000,
                showConfirmButton: false,
            });

            if (onDelete) onDelete(); // 🔁 Trigger refetch in parent
            onClose(); // ✅ Close the modal
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
                        <div className="flex justify-center items-center min-h-[8rem]">
                            {formData.qrCode ? (
                                <a
                                    href={formData.qrCode}
                                    download={`qr-${formData.itemName}.png`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={formData.qrCode}
                                        alt="QR Code"
                                        className="w-32 h-32 border border-green-300 rounded-md cursor-pointer hover:opacity-80 transition"
                                        title="Click to download QR code"
                                    />
                                </a>
                            ) : (
                                <p className="text-gray-500 italic">No QR code available</p>
                            )}
                        </div>
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
