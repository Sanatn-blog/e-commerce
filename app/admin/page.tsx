import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import DashboardStats from "./components/DashboardStats";
import RecentOrders from "./components/RecentOrders";
import SalesChart from "./components/SalesChart";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <DashboardStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <SalesChart />
            <RecentOrders />
          </div>
        </main>
      </div>
    </div>
  );
}
