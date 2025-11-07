import AdminSidebar from "../../../components/AdminSidebar";
import AdminHeader from "../../../components/AdminHeader";
import CategoryForm from "../../components/CategoryForm";
import { Toaster } from "react-hot-toast";

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-right" />
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Edit Category
          </h1>
          <CategoryForm categoryId={params.id} />
        </main>
      </div>
    </div>
  );
}
