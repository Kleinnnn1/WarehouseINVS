import { useState } from "react";
import AddItemModal from "../components/AddItemModal";

function AddItemButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = (data) => {
        console.log("Item Added:", data);
        // send to API or update state
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md 
                           transition-all duration-300 transform hover:scale-105 hover:shadow-green-400"
            >
                Add Item
            </button>

            <AddItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </>
    );
}

export default AddItemButton;
