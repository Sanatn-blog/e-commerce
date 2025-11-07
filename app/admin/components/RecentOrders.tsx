const orders = [
  { id: "#1234", customer: "John Doe", amount: "$125.00", status: "Completed" },
  {
    id: "#1235",
    customer: "Jane Smith",
    amount: "$89.50",
    status: "Processing",
  },
  {
    id: "#1236",
    customer: "Bob Johnson",
    amount: "$210.00",
    status: "Shipped",
  },
  { id: "#1237", customer: "Alice Brown", amount: "$45.00", status: "Pending" },
  {
    id: "#1238",
    customer: "Charlie Wilson",
    amount: "$156.75",
    status: "Completed",
  },
];

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Order ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-sm text-gray-900">{order.id}</td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {order.amount}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
