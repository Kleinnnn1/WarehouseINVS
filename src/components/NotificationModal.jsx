function NotificationModal({ onClose, notifications }) {
    return (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-lg border-2 border-yellow-400">
                <h2 className="text-2xl font-bold text-yellow-600 mb-4">Notifications</h2>
                {notifications.length === 0 ? (
                    <p className="text-gray-500">You're all caught up!</p>
                ) : (
                    <ul className="space-y-2">
                        {notifications.map((note, idx) => (
                            <li
                                key={idx}
                                className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded-md text-yellow-800 shadow-sm"
                            >
                                {note}
                            </li>
                        ))}
                    </ul>
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
