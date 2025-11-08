export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Returns & Refunds
          </h1>
          <p className="text-xl text-gray-600">Our hassle-free return policy</p>
        </div>

        <div className="space-y-6">
          {/* Return Policy */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Return Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We want you to be completely satisfied with your purchase. If
              you're not happy with your order, you can return it within 30 days
              of delivery for a full refund or exchange.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-gray-700 font-semibold">
                30-Day Money Back Guarantee
              </p>
              <p className="text-gray-600 text-sm mt-1">
                All items can be returned within 30 days of delivery
              </p>
            </div>
          </div>

          {/* Return Requirements */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Return Requirements
            </h2>
            <p className="text-gray-700 mb-4">
              To be eligible for a return, items must meet the following
              conditions:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-2 flex-shrink-0"
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
                  Items must be unused and in the same condition as received
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-2 flex-shrink-0"
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
                <span>Items must be in their original packaging</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-2 flex-shrink-0"
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
                <span>All tags and labels must be attached</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-2 flex-shrink-0"
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
                <span>Proof of purchase or receipt must be provided</span>
              </li>
            </ul>
          </div>

          {/* How to Return */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How to Return an Item
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Contact Us
                  </h3>
                  <p className="text-gray-700">
                    Email us at returns@ourstore.com or call customer service to
                    initiate your return
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Get Your Return Label
                  </h3>
                  <p className="text-gray-700">
                    We'll email you a prepaid return shipping label
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Pack Your Item
                  </h3>
                  <p className="text-gray-700">
                    Securely pack the item in its original packaging with all
                    accessories
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Ship It Back
                  </h3>
                  <p className="text-gray-700">
                    Drop off your package at any authorized shipping location
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Process */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Refund Process
            </h2>
            <p className="text-gray-700 mb-4">
              Once we receive your return, we'll inspect the item and process
              your refund within 5-7 business days. The refund will be issued to
              your original payment method.
            </p>
            <p className="text-gray-700">
              You'll receive an email confirmation once your refund has been
              processed. Please allow 5-10 business days for the refund to
              appear in your account, depending on your bank or credit card
              company.
            </p>
          </div>

          {/* Exchanges */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Exchanges
            </h2>
            <p className="text-gray-700 mb-4">
              If you'd like to exchange an item for a different size, color, or
              product, please follow the return process above and place a new
              order for the item you want.
            </p>
            <p className="text-gray-700">
              This ensures you receive your new item as quickly as possible.
            </p>
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Non-Returnable Items
            </h2>
            <p className="text-gray-700 mb-4">
              The following items cannot be returned:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Gift cards</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Downloadable software or digital products</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Personal care items (opened)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Final sale or clearance items</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">
              Questions about returns? Our customer service team is here to
              help!
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
