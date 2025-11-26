import { FaMapMarkedAlt, FaHotel, FaRoute, FaShieldAlt } from "react-icons/fa";

export default function FeaturesSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-800">
          Explore With Confidence
        </h2>
        <p className="text-gray-500 mt-3 text-lg">
          Smart, modern and reliable features to make your travel stress-free.
        </p>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8 mt-14">

          {/* CARD 1 */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-teal-500/20 hover:shadow-teal-300/50 transition-all duration-300 hover:-translate-y-2">
            <div className="text-teal-600 text-5xl flex justify-center">
              <FaMapMarkedAlt />
            </div>
            <h3 className="text-xl font-semibold mt-5 text-gray-800">
              Tourism Map
            </h3>
            <p className="text-gray-600 mt-2">
              Navigate top tourist destinations across Pakistan through a smart
              map-based interface.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-teal-500/20 hover:shadow-teal-300/50 transition-all duration-300 hover:-translate-y-2">
            <div className="text-teal-600 text-5xl flex justify-center">
              <FaHotel />
            </div>
            <h3 className="text-xl font-semibold mt-5 text-gray-800">
              Hotels & Restaurants
            </h3>
            <p className="text-gray-600 mt-2">
              Explore verified hotels and restaurants with detailed ratings and reviews.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-teal-500/20 hover:shadow-teal-300/50 transition-all duration-300 hover:-translate-y-2">
            <div className="text-teal-600 text-5xl flex justify-center">
              <FaRoute />
            </div>
            <h3 className="text-xl font-semibold mt-5 text-gray-800">
              Smart Route Suggestions
            </h3>
            <p className="text-gray-600 mt-2">
              Get the best travel routes for road trips, flights, and transit options.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-teal-500/20 hover:shadow-teal-300/50 transition-all duration-300 hover:-translate-y-2">
            <div className="text-teal-600 text-5xl flex justify-center">
              <FaShieldAlt />
            </div>
            <h3 className="text-xl font-semibold mt-5 text-gray-800">
              Safety First
            </h3>
            <p className="text-gray-600 mt-2">
              Live safety alerts, weather updates, and smart travel precautions.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
