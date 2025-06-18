import { useState, useEffect } from "react";
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
import { supabase } from "../../service/supabaseClient"
import AddStockModal from "../../components/AddModalStock";

function StocksPage() {

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from("items")
                    .select("*")
                    .order("id", { ascending: true });

                if (error) {
                    console.error("Supabase error fetching items:", error.message);
                } else {
                    console.log("Fetched items from Supabase:", data);
                    setItems(data);
                }
            } catch (err) {
                console.error("Unexpected error fetching items:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const notifications = [
        "Item A stock is low.",
        "New stock added for Item B.",
        "System maintenance scheduled tomorrow.",
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
    const [items, setItems] = useState([]);
    const [logs, setLogs] = useState(sampleLogs);
    const [showModal, setShowModal] = useState(false);
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddStockModal, setShowAddStockModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleAddStock = (item) => {
        setSelectedItem(item);
        setShowAddStockModal(true);
    };

    const handleConfirmAddStock = (quantity) => {
        updateStock(selectedItem.id, quantity, "Added");
        setShowAddStockModal(false);
        setSelectedItem(null);
    };


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
                {loading ? (
                    <p>Loading items...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onTake={(id) => updateStock(id, -1, "Taken")}
                                onAdd={(item) => handleAddStock(item)}
                                onEdit={(item) => {
                                    setCurrentItem(item);
                                    setShowEditModal(true);
                                }}
                            />
                        ))}
                    </div>
                )}


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

            {showAddStockModal && selectedItem && (
                <AddStockModal
                    isOpen={showAddStockModal}
                    onClose={() => setShowAddStockModal(false)}
                    onSubmit={handleConfirmAddStock}
                    item={selectedItem}
                />
            )}
        </>
    );

}

export default StocksPage;
