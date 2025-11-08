export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted destination for quality products and exceptional
            service
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Story
          </h2>
          <p className="text-gray-700 mb-4">
            Founded with a passion for delivering quality products, our store
            has been serving customers with dedication and excellence. We
            believe in providing not just products, but experiences that enhance
            your lifestyle.
          </p>
          <p className="text-gray-700">
            Our journey began with a simple mission: to make quality products
            accessible to everyone. Today, we continue to uphold that mission by
            carefully curating our collection and ensuring every customer
            receives the best service possible.
          </p>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality First
              </h3>
              <p className="text-gray-700">
                We carefully select every product to ensure it meets our high
                standards of quality and durability.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Customer Focus
              </h3>
              <p className="text-gray-700">
                Your satisfaction is our priority. We&apos;re here to provide
                exceptional service and support.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trust & Integrity
              </h3>
              <p className="text-gray-700">
                We build lasting relationships through honest business practices
                and transparent communication.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Why Choose Us
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-2 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Wide selection of quality products across multiple categories
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-2 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Secure and convenient online shopping experience</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-2 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Fast and reliable shipping to your doorstep</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-2 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Dedicated customer support team ready to assist you</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-2 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Easy returns and hassle-free refund policy</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
