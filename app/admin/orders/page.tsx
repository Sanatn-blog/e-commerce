import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import OrdersTable from "./components/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>
          <OrdersTable />
        </main>
      </div>
    </div>
  );
}
