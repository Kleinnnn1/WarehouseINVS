import { FaBell } from "react-icons/fa";

function NotificationButton({ onClick, hasNotifications = true }) {
    return (
        <button
            onClick={onClick}
            className="relative bg-white text-yellow-500 p-3 rounded-full shadow-md hover:bg-yellow-100 
                       transform hover:scale-110 transition-all duration-300"
        >
            <FaBell className="text-xl" />
        </button>
    );
}

export default NotificationButton;
