import { useState } from "react";
import AddItemButton from "../../components/AddItemButton";
import SettingsButton from "../../components/SettingButton";
import NotificationButton from "../../components/NotificationButton";
import ItemCard from "../../components/ItemCard";
import ActivityLogItem from "../../components/ActivityLogItem";
import NotificationModal from "../../components/NotificationModal";
import ScannerButton from "../../components/ScannerButton";
import ScannerModal from "../../components/ScannerModal";
import Background from "../../assets/images/background.jpg"
import EditItemModal from "../../components/EditItemModal";

function StocksPage() {

    const notifications = [
        "Item A stock is low.",
        "New stock added for Item B.",
        "System maintenance scheduled tomorrow.",
    ];

    const sampleItems = [
        { id: 1, name: "PC", price: 100, stock: 10 },
        { id: 2, name: "Oil", price: 150, stock: 5 },
        { id: 3, name: "Table", price: 200, stock: 8 },
    ];

    const sampleLogs = [
        {
            id: 1,
            action: "Taken",
            item: "Item A",
            quantity: 2,
            timestamp: "6/18/2025, 10:24:00 AM",
        },
        {
            id: 2,
            action: "Added",
            item: "Item B",
            quantity: 5,
            timestamp: "6/18/2025, 9:55:12 AM",
        },
        {
            id: 3,
            action: "Taken",
            item: "Item C",
            quantity: 1,
            timestamp: "6/18/2025, 8:40:33 AM",
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState(sampleItems);
    const [logs, setLogs] = useState(sampleLogs);
    const [showModal, setShowModal] = useState(false);
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const handleSaveEditedItem = (updatedItem) => {
        setItems(items.map(i => (i.id === updatedItem.id ? updatedItem : i)));
    };

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
        <>
            {showModal && (
                <NotificationModal
                    onClose={() => setShowModal(false)}
                    notifications={notifications}
                />
            )}

            <div
                className="min-h-screen bg-cover bg-center text-green-800 p-8"
                style={{ backgroundImage: `url(${Background})` }}
            >

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-green-700">Warehouse POS System</h1>

                    <div className="flex gap-3">
                        {showModal && (
                            <NotificationModal
                                onClose={() => setShowModal(false)}
                                notifications={notifications}
                            />
                        )}

                        {showScannerModal && (
                            <ScannerModal onClose={() => setShowScannerModal(false)} />
                        )}

                        <ScannerButton onClick={() => setShowScannerModal(true)} />
                        <NotificationButton onClick={() => setShowModal(true)} />
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
                        <ItemCard
                            key={item.id}
                            item={item}
                            onTake={(id) => updateStock(id, -1, "Taken")}
                            onAdd={(id) => updateStock(id, 1, "Added")}
                            onEdit={(item) => {
                                setCurrentItem(item);
                                setShowEditModal(true);
                            }}
                        />

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
                                <ActivityLogItem key={log.id} log={log} />
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {showEditModal && currentItem && (
                <EditItemModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveEditedItem}
                    item={currentItem}
                />
            )}
        </>
    );

}

export default StocksPage;
