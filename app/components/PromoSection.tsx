import Link from "next/link";

export default function PromoSection() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Promo 1 */}
        <div className="relative bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-3">New Arrivals</h3>
            <p className="mb-6 text-blue-100">
              Check out our latest collection
            </p>
            <Link
              href="/new-arrivals"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Explore Now
            </Link>
          </div>
          <svg
            className="absolute right-4 bottom-4 w-32 h-32 opacity-20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* Promo 2 */}
        <div className="relative bg-linear-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-3">Mega Sale</h3>
            <p className="mb-6 text-orange-100">
              Up to 70% off on selected items
            </p>
            <Link
              href="/sale"
              className="inline-block bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Sale
            </Link>
          </div>
          <svg
            className="absolute right-4 bottom-4 w-32 h-32 opacity-20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
