import { useState } from "react";
import AddItemButton from "../../components/AddItemButton";
import SettingsButton from "../../components/SettingButton";
import NotificationButton from "../../components/NotificationButton";

const sampleItems = [
    { id: 1, name: "Item A", price: 100, stock: 10 },
    { id: 2, name: "Item B", price: 150, stock: 5 },
    { id: 3, name: "Item C", price: 200, stock: 8 },
];

function StocksPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState(sampleItems);
    const [logs, setLogs] = useState([]);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updateStock = (itemId, delta, action) => {
        setItems(items.map(item =>
            item.id === itemId
                ? { ...item, stock: Math.max(item.stock + delta, 0) }
                : item
        ));

        const itemName = items.find(i => i.id === itemId)?.name;
        const quantity = Math.abs(delta);

        setLogs(prev => [
            {
                id: Date.now(),
                action,
                item: itemName,
                quantity,
                timestamp: new Date().toLocaleString(),
            },
            ...prev
        ]);
    };

    return (
        <div className="min-h-screen bg-gray-100 text-green-800 p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-green-700">Warehouse POS System</h1>

                <div className="flex gap-3">
                    <NotificationButton />
                    <AddItemButton />
                    <SettingsButton />
                </div>
            </div>


            {/* Search */}
            <input
                type="text"
                placeholder="Search for item..."
                className="w-full p-3 rounded-md border border-green-300 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Item Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="border border-green-500 p-4 rounded-lg shadow transition transform hover:shadow-green-400 hover:scale-105">
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p>₱{item.price}</p>
                        <p className="text-sm text-gray-500">Stock: {item.stock}</p>

                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => updateStock(item.id, -1, "Taken")}
                                disabled={item.stock === 0}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full"
                            >
                                Take Item
                            </button>
                            <button
                                onClick={() => updateStock(item.id, 1, "Added")}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full"
                            >
                                Add Stock
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Logs */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Recent Activity Log</h2>
                {logs.length === 0 ? (
                    <p className="text-gray-600">No activity yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {logs.map(log => (
                            <li key={log.id} className="bg-white p-3 rounded-md shadow border-l-4 border-green-400">
                                <div className="flex justify-between">
                                    <span className="font-medium">{log.action} — {log.item} x{log.quantity}</span>
                                    <span className="text-sm text-gray-500">{log.timestamp}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default StocksPage;
