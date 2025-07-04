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
import LogoutIcon from "../../components/LogoutIcon";
import AddItemModal from "../../components/AddItemModal"
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
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5;
    const [itemPage, setItemPage] = useState(1);
    const itemsPerPage = 9;

    const filteredItems = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = itemPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalItemPages = Math.ceil(filteredItems.length / itemsPerPage);



    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

    const totalPages = Math.ceil(logs.length / logsPerPage);

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
        // Optional: keep optimistic update
        updateStock(takingItem.id, -1);

        try {
            await fetchItemsAndLogs(); // ✅ Refetch items, logs, and notifications
        } catch (error) {
            console.error("Failed to refetch data after taking item:", error);
        }

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

    const fetchNotificationsOnly = async () => {
        try {
            const updated = await fetchNotifications();
            setNotifications(updated);
        } catch (err) {
            console.error("Failed to refetch notifications:", err.message);
        }
    };

    return (
        <>
            {showModal && (
                <NotificationModal
                    onClose={async () => {
                        await fetchNotificationsOnly();  // ✅ Refresh notifications after modal closes
                        setShowModal(false);
                    }}
                    notifications={notifications}
                />
            )}


            {showScannerModal && (
                <ScannerModal onClose={() => setShowScannerModal(false)} />
            )}

            <div
                className="min-h-screen bg-cover bg-center text-green-800 p-4 sm:p-8"
                style={{ backgroundImage: `url(${Background})` }}
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-green-700">Warehouse Inventory System</h1>


                    <div className="flex flex-wrap justify-center md:justify-end gap-3">
                        <LogoutIcon />
                        <ScannerButton onClick={() => setShowScannerModal(true)} />
                        <NotificationButton
                            onClick={() => setShowModal(true)}
                            count={notifications.filter(n => !n.mark).length}
                        />
                        <AddItemButton onClick={() => setShowAddItemModal(true)} />
                        <SettingsButton />
                    </div>
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search for item..."
                        className="w-full p-3 rounded-md border border-green-300 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p>Loading items...</p>
                ) : filteredItems.length === 0 ? (
                    <p className="text-gray-600 text-center">No available items.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentItems.map(item => (
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

                        {/* ✅ Item pagination controls go here */}
                        {totalItemPages > 1 && (
                            <div className="flex flex-wrap justify-center items-center mt-6 gap-2">
                                <button
                                    onClick={() => setItemPage((prev) => Math.max(prev - 1, 1))}
                                    className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                                    disabled={itemPage === 1}
                                >
                                    Prev
                                </button>
                                <span className="px-3 py-1 text-green-800 font-medium">
                                    Page {itemPage} of {totalItemPages}
                                </span>
                                <button
                                    onClick={() => setItemPage((prev) => Math.min(prev + 1, totalItemPages))}
                                    className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                                    disabled={itemPage === totalItemPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}


                {/* Action Logs */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Recent Activity Log</h2>
                    {logs.length === 0 ? (
                        <p className="text-gray-600">No activity yet.</p>
                    ) : (
                        <ul className="space-y-3 text-sm sm:text-base">
                            {currentLogs.map(log => (
                                <ActivityLogItem key={log.id} log={log} />
                            ))}
                        </ul>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="px-3 py-1 text-green-800 font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {showEditModal && currentItem && (
                <EditItemModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveEditedItem}
                    onDelete={fetchItemsAndLogs} // 🔁 this will refetch items + logs
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

            {showAddItemModal && (
                <AddItemModal
                    isOpen={showAddItemModal}
                    onClose={() => setShowAddItemModal(false)}
                    onSave={async () => {
                        await fetchItemsAndLogs();   // ✅ Refetch new data
                        setShowAddItemModal(false); // ✅ Close the modal
                    }}
                />
            )}
        </>
    );
}

export default StocksPage;
