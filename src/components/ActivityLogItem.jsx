function ActivityLogItem({ log }) {
    return (
        <li className="bg-white p-3 rounded-md shadow border-l-4 border-green-400">
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-medium">
                        {log.action} — {log.item} x{log.quantity}
                    </span>
                    {log.reason && (
                        <p className="text-sm text-gray-600 mt-1">Reason: {log.reason}</p>
                    )}
                </div>
                <span className="text-sm text-gray-500">{log.timestamp}</span>
            </div>
        </li>
    );
}

export default ActivityLogItem;
