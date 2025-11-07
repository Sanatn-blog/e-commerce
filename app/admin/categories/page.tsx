import Link from "next/link";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import CategoriesTable from "./components/CategoriesTable";
import { Toaster } from "react-hot-toast";

export default function CategoriesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-right" />
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <Link
              href="/admin/categories/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Category
            </Link>
          </div>
          <CategoriesTable />
        </main>
      </div>
    </div>
  );
}
