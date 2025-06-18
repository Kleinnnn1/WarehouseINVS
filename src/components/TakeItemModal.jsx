import { useState } from "react";

function TakeItemModal({ isOpen, onClose, onSubmit, item }) {
    const [who, setWho] = useState("");
    const [when, setWhen] = useState(new Date().toISOString().slice(0, 16)); // default to now
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm border-2 border-green-500">
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

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSubmit({
                                who,
                                when,
                                reason
                            });
                            setWho("");
                            setWhen(new Date().toISOString().slice(0, 16));
                            setReason("");
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

export default TakeItemModal;
