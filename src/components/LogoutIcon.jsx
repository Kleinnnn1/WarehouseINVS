import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../service/StocksApi";

function LogoutIcon({ onCloseDropdown }) {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await logoutUser();
      if (onCloseDropdown) onCloseDropdown(); // optional: close menu
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white text-red-500 p-3 rounded-full shadow-md
                 hover:bg-red-100 hover:text-red-600 transition-all duration-300
                 transform hover:scale-110"
    >
      <FaSignOutAlt className="text-xl" />
    </button>
  );
}

export default LogoutIcon;
