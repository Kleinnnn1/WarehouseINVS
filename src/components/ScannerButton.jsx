import { FaQrcode } from "react-icons/fa";

function ScannerButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-white text-pink-500 p-3 rounded-full shadow-md hover:bg-pink-100 hover:text-pink-600 
                       transition-all duration-300 transform hover:scale-110"
        >
            <FaQrcode className="text-xl" />
        </button>
    );
}

export default ScannerButton;
