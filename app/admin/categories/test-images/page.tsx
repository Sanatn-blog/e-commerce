"use client";

import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

export default function TestImagesPage() {
  const testImages = [
    {
      name: "Cloudinary Test",
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    {
      name: "Placeholder",
      url: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Test Image Display
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 mb-4">
              Testing image display to verify images are loading correctly:
            </p>
            <div className="space-y-4">
              {testImages.map((img, index) => (
                <div key={index} className="border p-4 rounded">
                  <h3 className="font-semibold mb-2">{img.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 break-all">
                    {img.url}
                  </p>
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.border = "2px solid red";
                      console.error("Failed to load:", img.url);
                    }}
                    onLoad={() => console.log("Loaded:", img.url)}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
