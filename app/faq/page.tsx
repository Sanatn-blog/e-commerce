"use client";

import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: "Orders & Payment",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All payments are processed securely through our encrypted payment gateway.",
        },
        {
          q: "Can I modify or cancel my order?",
          a: "You can modify or cancel your order within 1 hour of placing it. After that, the order enters our processing system. Please contact customer service immediately if you need to make changes.",
        },
        {
          q: "Do you offer gift wrapping?",
          a: "Yes! We offer gift wrapping services for an additional ₹50 per item. You can select this option during checkout.",
        },
        {
          q: "How do I use a promo code?",
          a: "Enter your promo code in the designated field during checkout. The discount will be applied to your order total before payment.",
        },
      ],
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight shipping delivers the next business day. Processing time is 1-2 business days.",
        },
        {
          q: "Do you ship internationally?",
          a: "Yes, we ship to select countries. International shipping times vary by destination. Additional customs fees may apply and are the responsibility of the customer.",
        },
        {
          q: "How can I track my order?",
          a: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.",
        },
        {
          q: "What if my package is lost or damaged?",
          a: "If your package is lost or arrives damaged, please contact us immediately. We'll work with the carrier to resolve the issue and ensure you receive your items.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer a 30-day return policy. Items must be unused, in original packaging, with all tags attached. Contact us to initiate a return and receive a prepaid shipping label.",
        },
        {
          q: "How long does it take to receive a refund?",
          a: "Refunds are processed within 5-7 business days after we receive your return. It may take an additional 5-10 business days for the refund to appear in your account.",
        },
        {
          q: "Can I exchange an item?",
          a: "To exchange an item, please return the original item and place a new order. This ensures you receive your new item as quickly as possible.",
        },
        {
          q: "Who pays for return shipping?",
          a: "We provide a prepaid return shipping label for all eligible returns. If the return is due to our error, we cover all shipping costs.",
        },
      ],
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "Do I need an account to place an order?",
          a: "No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, and access exclusive offers.",
        },
        {
          q: "How do I reset my password?",
          a: "Click on 'Forgot Password' on the login page. Enter your email address and we'll send you instructions to reset your password.",
        },
        {
          q: "Is my personal information secure?",
          a: "Yes, we use industry-standard SSL encryption to protect your personal and payment information. We never share your data with third parties without your consent.",
        },
        {
          q: "How do I update my account information?",
          a: "Log into your account and navigate to 'Account Settings' where you can update your personal information, addresses, and preferences.",
        },
      ],
    },
    {
      category: "Products",
      questions: [
        {
          q: "Are your products authentic?",
          a: "Yes, all our products are 100% authentic and sourced directly from authorized distributors and manufacturers.",
        },
        {
          q: "Do you restock sold-out items?",
          a: "We regularly restock popular items. You can sign up for email notifications on product pages to be alerted when items are back in stock.",
        },
        {
          q: "Can I see products in person before buying?",
          a: "We're an online-only store, but we offer detailed product descriptions, high-quality images, and customer reviews to help you make informed decisions.",
        },
        {
          q: "Do you offer warranties on products?",
          a: "Many of our products come with manufacturer warranties. Warranty information is listed on individual product pages.",
        },
      ],
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our store
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={questionIndex}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full flex items-center justify-between py-4 text-left hover:text-blue-600 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">
                          {faq.q}
                        </span>
                        <svg
                          className={`w-5 h-5 shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="pb-4 text-gray-700">{faq.a}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-700 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our customer
            service team is here to help!
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
  );
}
