"use client";

export default function SalesChart() {
  const data = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 5500 },
  ];

  const maxSales = Math.max(...data.map((d) => d.sales));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Overview</h2>
      <div className="flex items-end justify-between h-64 space-x-2">
        {data.map((item) => (
          <div key={item.month} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors"
              style={{ height: `${(item.sales / maxSales) * 100}%` }}
            ></div>
            <p className="text-xs text-gray-600 mt-2">{item.month}</p>
            <p className="text-xs text-gray-500">
              ${(item.sales / 1000).toFixed(1)}k
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
