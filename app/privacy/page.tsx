export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Introduction */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700">
              At Our Store, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website and make purchases. Please
              read this privacy policy carefully.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Personal Information
            </h3>
            <p className="text-gray-700 mb-3">
              We may collect personal information that you voluntarily provide
              to us when you:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Register for an account</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Make a purchase</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Subscribe to our newsletter</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Contact customer service</span>
              </li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Automatically Collected Information
            </h3>
            <p className="text-gray-700">
              When you visit our website, we may automatically collect certain
              information about your device, including your IP address, browser
              type, operating system, and browsing behavior.
            </p>
          </div>

          {/* How We Use Your Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-3">
              We use the information we collect to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Process and fulfill your orders</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Communicate with you about your orders and account</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Send you marketing communications (with your consent)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Improve our website and customer service</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Prevent fraud and enhance security</span>
              </li>
            </ul>
          </div>

          {/* Information Sharing */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-700 mb-3">
              We do not sell your personal information. We may share your
              information with:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Service providers who help us operate our business</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Payment processors to complete transactions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Shipping companies to deliver your orders</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Law enforcement when required by law</span>
              </li>
            </ul>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="text-gray-700">
              We implement appropriate technical and organizational security
              measures to protect your personal information. However, no method
              of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Access your personal information</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Correct inaccurate information</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Request deletion of your information</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Opt-out of marketing communications</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Object to processing of your information</span>
              </li>
            </ul>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookies
            </h2>
            <p className="text-gray-700">
              We use cookies and similar tracking technologies to enhance your
              browsing experience, analyze site traffic, and understand where
              our visitors are coming from. You can control cookies through your
              browser settings.
            </p>
          </div>

          {/* Children's Privacy */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700">
              Our website is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13.
            </p>
          </div>

          {/* Changes to Privacy Policy */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </div>

          {/* Contact Us */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact
              us:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Email: privacy@ourstore.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Store Street, City, State 12345</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
