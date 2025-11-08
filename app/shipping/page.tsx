export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Information
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about our shipping policies
          </p>
        </div>

        <div className="space-y-6">
          {/* Shipping Methods */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Shipping Methods
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Standard Shipping
                </h3>
                <p className="text-gray-700 mb-2">
                  Delivery in 5-7 business days
                </p>
                <p className="text-gray-600">
                  Cost: $5.99 (Free on orders over $50)
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Express Shipping
                </h3>
                <p className="text-gray-700 mb-2">
                  Delivery in 2-3 business days
                </p>
                <p className="text-gray-600">Cost: $12.99</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Overnight Shipping
                </h3>
                <p className="text-gray-700 mb-2">Next business day delivery</p>
                <p className="text-gray-600">Cost: $24.99</p>
              </div>
            </div>
          </div>

          {/* Processing Time */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Processing Time
            </h2>
            <p className="text-gray-700 mb-4">
              Orders are typically processed within 1-2 business days. You will
              receive a confirmation email once your order has been placed, and
              a shipping confirmation with tracking information once your order
              has been shipped.
            </p>
            <p className="text-gray-700">
              Please note that processing times may be longer during peak
              seasons and holidays.
            </p>
          </div>

          {/* Tracking Your Order */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tracking Your Order
            </h2>
            <p className="text-gray-700 mb-4">
              Once your order ships, you'll receive an email with a tracking
              number. You can use this number to track your package on the
              carrier's website.
            </p>
            <p className="text-gray-700">
              You can also track your order by logging into your account and
              viewing your order history.
            </p>
          </div>

          {/* Shipping Restrictions */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Shipping Restrictions
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>We currently ship to all 50 US states</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  International shipping is available to select countries
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>We do not ship to PO boxes for certain items</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Some products may have shipping restrictions based on local
                  regulations
                </span>
              </li>
            </ul>
          </div>

          {/* Shipping Issues */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Shipping Issues
            </h2>
            <p className="text-gray-700 mb-4">
              If your package is lost, damaged, or delayed, please contact our
              customer service team immediately. We'll work with the carrier to
              resolve the issue as quickly as possible.
            </p>
            <p className="text-gray-700">
              For damaged items, please keep all packaging materials and take
              photos of the damage for our records.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">
              Have questions about shipping? We're here to help!
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
