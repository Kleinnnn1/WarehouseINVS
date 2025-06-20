function AddItemButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md 
                       transition-all duration-300 transform hover:scale-105 hover:shadow-green-400"
        >
            Add Item
        </button>
    );
}

export default AddItemButton;
