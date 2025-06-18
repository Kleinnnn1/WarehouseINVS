import { MdInfoOutline } from 'react-icons/md';

function ItemCard({ item, onTake, onAdd, onEdit }) {
    return (
        <div className="relative border border-green-500 p-4 rounded-lg shadow transition transform hover:shadow-green-400 hover:scale-105">
            <MdInfoOutline
                className="absolute top-2 right-2 text-green-600 bg-white rounded-full p-1 w-8 h-8 
                hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-110 cursor-pointer"
                onClick={() => onEdit(item)}
            />
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p>₱{item.price}</p>
            <p className="text-sm text-gray-500">Stock: {item.stock}</p>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => onTake(item)}
                    disabled={item.stock === 0}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full"
                >
                    Take Item
                </button>
                <button
                    onClick={() => onAdd(item)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full"
                >
                    Add Stock
                </button>

            </div>
        </div>
    );
}

export default ItemCard;
