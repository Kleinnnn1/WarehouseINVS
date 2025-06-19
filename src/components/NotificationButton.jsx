import { FaBell } from "react-icons/fa";

function NotificationButton({ onClick, hasNotifications = true, count = 0 }) {
    return (
        <button
            onClick={onClick}
            className="relative bg-white text-yellow-500 p-3 rounded-full shadow-md hover:bg-yellow-100 
                       transform hover:scale-110 transition-all duration-300"
        >
            <FaBell className="text-xl" />
            {hasNotifications && count > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ minWidth: "1.25rem", textAlign: "center" }}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

export default NotificationButton;
