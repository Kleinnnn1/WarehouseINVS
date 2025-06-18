import { useNavigate } from "react-router-dom";

function SettingsButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/setting")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md 
                       transition-all duration-300 transform hover:scale-105 hover:shadow-green-400"
        >
            ⚙ Settings
        </button>
    );
}

export default SettingsButton;
