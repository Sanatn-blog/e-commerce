import { Eye } from "lucide-react";

const orders = [
  {
    id: "#1234",
    customer: "John Doe",
    date: "2025-11-05",
    amount: "$125.00",
    status: "Completed",
    items: 3,
  },
  {
    id: "#1235",
    customer: "Jane Smith",
    date: "2025-11-06",
    amount: "$89.50",
    status: "Processing",
    items: 2,
  },
  {
    id: "#1236",
    customer: "Bob Johnson",
    date: "2025-11-06",
    amount: "$210.00",
    status: "Shipped",
    items: 5,
  },
  {
    id: "#1237",
    customer: "Alice Brown",
    date: "2025-11-07",
    amount: "$45.00",
    status: "Pending",
    items: 1,
  },
  {
    id: "#1238",
    customer: "Charlie Wilson",
    date: "2025-11-07",
    amount: "$156.75",
    status: "Completed",
    items: 4,
  },
];

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Order ID
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Customer
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Items
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-6 text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {order.date}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {order.items}
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">
                  {order.amount}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
