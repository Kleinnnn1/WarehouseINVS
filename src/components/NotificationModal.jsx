import { useState } from "react";
import { markNotificationAsRead } from "../service/StocksApi"; // adjust path if needed

function NotificationModal({ onClose, notifications }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [localNotifications, setLocalNotifications] = useState(notifications);

    const itemsPerPage = 4;
    const totalPages = Math.ceil(localNotifications.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentNotifications = localNotifications.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNotificationClick = async (id) => {
        try {
            await markNotificationAsRead(id);

            // Update UI state locally
            setLocalNotifications(prev =>
                prev.map(note => note.id === id ? { ...note, mark: true } : note)
            );
        } catch (error) {
            console.error("Error marking notification:", error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-lg border-2 border-yellow-400">
                <h2 className="text-2xl font-bold text-yellow-600 mb-4">Notifications</h2>

                {localNotifications.length === 0 ? (
                    <p className="text-gray-500">You're all caught up!</p>
                ) : (
                    <>
                        <ul className="space-y-2">
                            {currentNotifications.map((note) => {
                                const match = note.message.match(/^⚠️ Low Stock Alert: (.+?) is running low/);
                                const itemName = match ? match[1] : null;

                                return (
                                    <li
                                        key={note.id}
                                        onClick={() => handleNotificationClick(note.id)}
                                        className={`cursor-pointer p-3 rounded-md shadow-sm border-l-4 ${
                                            note.mark
                                                ? "bg-gray-200 border-gray-400 text-gray-700"
                                                : "bg-yellow-100 border-yellow-500 text-yellow-800"
                                        }`}
                                    >
                                        {itemName ? (
                                            <>
                                                ⚠️ Low Stock Alert: <strong>{itemName}</strong> is running low. Please restock soon!
                                            </>
                                        ) : (
                                            note.message
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className="text-sm text-yellow-600 disabled:text-gray-300"
                            >
                                ← Previous
                            </button>
                            <span className="text-sm text-gray-500">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="text-sm text-yellow-600 disabled:text-gray-300"
                            >
                                Next →
                            </button>
                        </div>
                    </>
                )}

                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default NotificationModal;
