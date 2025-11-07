import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    JD
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">John Doe</h2>
                    <p className="text-sm text-gray-500">john@example.com</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <a
                    href="#profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </a>
                  <a
                    href="#orders"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Package size={20} />
                    <span>Orders</span>
                  </a>
                  <a
                    href="/wishlist"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Heart size={20} />
                    <span>Wishlist</span>
                  </a>
                  <a
                    href="#addresses"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <MapPin size={20} />
                    <span>Addresses</span>
                  </a>
                  <a
                    href="#payment"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <CreditCard size={20} />
                    <span>Payment Methods</span>
                  </a>
                  <a
                    href="#settings"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </a>
                  <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full">
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Profile Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile Information
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value="John"
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value="Doe"
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value="john@example.com"
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value="+1 (555) 123-4567"
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Orders
                  </h2>
                  <a
                    href="#orders"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </a>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div
                      key={order}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #ORD-{1000 + order}
                          </p>
                          <p className="text-sm text-gray-500">
                            Placed on Nov {order}, 2025
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          Delivered
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">
                            Product Name
                          </p>
                          <p className="text-sm text-gray-500">Quantity: 1</p>
                        </div>
                        <p className="font-semibold text-gray-900">$99.99</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Saved Addresses
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        Default
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        Edit
                      </button>
                    </div>
                    <p className="font-medium text-gray-900 mt-3">Home</p>
                    <p className="text-sm text-gray-600 mt-1">
                      123 Main Street
                    </p>
                    <p className="text-sm text-gray-600">New York, NY 10001</p>
                    <p className="text-sm text-gray-600">United States</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-500">Secondary</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        Edit
                      </button>
                    </div>
                    <p className="font-medium text-gray-900 mt-3">Office</p>
                    <p className="text-sm text-gray-600 mt-1">
                      456 Business Ave
                    </p>
                    <p className="text-sm text-gray-600">New York, NY 10002</p>
                    <p className="text-sm text-gray-600">United States</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
