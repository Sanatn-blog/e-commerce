import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import DashboardStats from "./components/DashboardStats";
import RecentOrders from "./components/RecentOrders";
import SalesChart from "./components/SalesChart";
import OrderStatusChart from "./components/OrderStatusChart";
import TopProducts from "./components/TopProducts";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>

          {/* Stats Cards */}
          <DashboardStats />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <SalesChart />
            </div>
            <div>
              <OrderStatusChart />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <TopProducts />
            <RecentOrders />
          </div>
        </main>
      </div>
    </div>
  );
}
