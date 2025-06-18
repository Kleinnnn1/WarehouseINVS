function ActivityLogItem({ log }) {
    return (
        <li className="bg-white p-3 rounded-md shadow border-l-4 border-green-400">
            <div className="flex justify-between">
                <span className="font-medium">
                    {log.action} — {log.item} x{log.quantity}
                </span>
                <span className="text-sm text-gray-500">{log.timestamp}</span>
            </div>
        </li>
    );
}

export default ActivityLogItem;
