import { useState } from "react";
import { supabase } from "../service/supabaseClient";

function TakeItemModal({ isOpen, onClose, onSubmit, item }) {
    const [who, setWho] = useState("");
    const [when, setWhen] = useState(new Date());
    const [reason, setReason] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        const parsedQty = parseInt(quantity, 10);

        if (isNaN(parsedQty) || parsedQty < 1) {
            setError("Quantity must be at least 1.");
            return;
        }

        if (parsedQty > item.stock) {
            setError(`Only ${item.stock} item(s) available.`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const newStock = item.stock - parsedQty;

            // 1. Update stock
            const { data: updatedItem, error: updateError } = await supabase
                .from("items")
                .update({ stock: newStock })
                .eq("id", item.id)
                .select()
                .single();

            if (updateError) {
                console.error("Error deducting stock:", updateError.message);
                setError("Failed to update stock.");
                return;
            }

            // 2. Insert log into activity_logs
            const { error: logError } = await supabase.from("activity_logs").insert({
                item_id: item.id,
                issued_to: who,
                issued_at: when,
                reason: reason,
                quantity: parsedQty,
                action_type: "take",
            });

            if (logError) {
                console.error("Error inserting log:", logError.message);
                setError("Stock updated, but failed to log activity.");
                return;
            }

            // 3. Notify parent component
            onSubmit({
                ...updatedItem,
                who,
                when,
                reason,
                quantity: parsedQty,
            });

            // Reset form
            setWho("");
            setWhen(new Date().toISOString().slice(0, 16));
            setReason("");
            setQuantity(1);
            onClose();
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm border-2 border-green-600">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Take Item: {item.name}</h2>

                <label className="block text-green-800 mb-1">🧍 Who took it?</label>
                <input
                    type="text"
                    value={who}
                    onChange={(e) => setWho(e.target.value)}
                    className="w-full p-2 mb-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />

                <label className="block text-green-800 mb-1">📅 When?</label>
                <input
                    type="datetime-local"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    className="w-full p-2 mb-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />

                <label className="block text-green-800 mb-1">📝 Reason</label>
                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 mb-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />

                <label className="block text-green-800 mb-1">🔢 Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    min="1"
                    max={item.stock}
                    className="w-full p-2 mb-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />

                {error && <p className="text-red-500 mt-2">{error}</p>}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                        {loading ? "Processing..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TakeItemModal;
