import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-rose-500 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Summer Collection 2024
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-rose-50">
              Discover the latest trends in fashion. Up to 50% off on selected
              items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-center"
              >
                Shop Now
              </Link>
              <Link
                href="/sale"
                className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-rose-600 transition text-center"
              >
                View Sale
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-80 flex items-center justify-center">
              <div className="text-white text-center">
                <svg
                  className="w-32 h-32 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="mt-4 text-lg font-semibold">Fashion Collection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
