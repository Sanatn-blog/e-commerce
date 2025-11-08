import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

const stats = [
  {
    label: "Total Revenue",
    value: "₹45,231",
    change: "+12.5%",
    icon: DollarSign,
    color: "bg-blue-500",
  },
  {
    label: "Orders",
    value: "1,234",
    change: "+8.2%",
    icon: ShoppingCart,
    color: "bg-green-500",
  },
  {
    label: "Customers",
    value: "892",
    change: "+5.1%",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    label: "Products",
    value: "456",
    change: "+2.3%",
    icon: Package,
    color: "bg-orange-500",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
