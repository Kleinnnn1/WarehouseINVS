import { useState, useEffect } from "react";
import AddItemButton from "../../components/AddItemButton";
import SettingsButton from "../../components/SettingButton";
import NotificationButton from "../../components/NotificationButton";
import ItemCard from "../../components/ItemCard";
import ActivityLogItem from "../../components/ActivityLogItem";
import NotificationModal from "../../components/NotificationModal";
import ScannerButton from "../../components/ScannerButton";
import ScannerModal from "../../components/ScannerModal";
import Background from "../../assets/images/background.jpg";
import EditItemModal from "../../components/EditItemModal";
import AddStockModal from "../../components/AddModalStock";
import TakeItemModal from "../../components/TakeItemModal";
import { fetchItems, fetchActivityLogs, fetchNotifications } from "../../service/StocksApi";

function StocksPage() {
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddStockModal, setShowAddStockModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showTakeModal, setShowTakeModal] = useState(false);
    const [takingItem, setTakingItem] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const fetchItemsAndLogs = async () => {
        setLoading(true);
        try {
            const [itemsData, logsData, notificationsData] = await Promise.all([
                fetchItems(),
                fetchActivityLogs(),
                fetchNotifications(),
            ]);
            setItems(itemsData);
            setLogs(logsData);
            setNotifications(notificationsData);
        } catch (err) {
            console.error("Error fetching data:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItemsAndLogs();
    }, []);

    const handleConfirmTakeItem = async () => {
        updateStock(takingItem.id, -1);
        const updatedLogs = await fetchActivityLogs();
        setLogs(updatedLogs);
        setTakingItem(null);
        setShowTakeModal(false);
    };

    const handleAddStock = (item) => {
        setSelectedItem(item);
        setShowAddStockModal(true);
    };

    const handleConfirmAddStock = async (updatedItem) => {
        setItems(prev =>
            prev.map(i => (i.id === updatedItem.id ? updatedItem : i))
        );
        setShowAddStockModal(false);
        setSelectedItem(null);
        const updatedLogs = await fetchActivityLogs();
        setLogs(updatedLogs);
    };

    const handleSaveEditedItem = (updatedItem) => {
        setItems(items.map(i => (i.id === updatedItem.id ? updatedItem : i)));
    };

    const updateStock = (itemId, delta) => {
        setItems(items.map(item =>
            item.id === itemId
                ? { ...item, stock: Math.max((item.stock || 0) + delta, 0) }
                : item
        ));
    };

    const filteredItems = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {showModal && (
                <NotificationModal
                    onClose={() => setShowModal(false)}
                    notifications={notifications}
                />
            )}

            {showScannerModal && (
                <ScannerModal onClose={() => setShowScannerModal(false)} />
            )}

            <div
                className="min-h-screen bg-cover bg-center text-green-800 p-8"
                style={{ backgroundImage: `url(${Background})` }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-green-700">Warehouse Inventory System</h1>

                    <div className="flex gap-3">
                        <ScannerButton onClick={() => setShowScannerModal(true)} />
                        <NotificationButton
                            onClick={() => setShowModal(true)}
                            count={notifications.filter(n => !n.mark).length}
                        />
                        <AddItemButton />
                        <SettingsButton />
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Search for item..."
                    className="w-full p-3 rounded-md border border-green-300 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {loading ? (
                    <p>Loading items...</p>
                ) : filteredItems.length === 0 ? (
                    <p className="text-gray-600 text-center">No available items.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onTake={(item) => {
                                    setTakingItem(item);
                                    setShowTakeModal(true);
                                }}
                                onAdd={handleAddStock}
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

            {showTakeModal && takingItem && (
                <TakeItemModal
                    isOpen={showTakeModal}
                    onClose={() => setShowTakeModal(false)}
                    onSubmit={handleConfirmTakeItem}
                    item={takingItem}
                />
            )}
        </>
    );
}

export default StocksPage;
