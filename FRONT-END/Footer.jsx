export default function Footer() {
  return (
    <footer className="bg-teal-700 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">

        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold">TravelEase</h2>
          <p className="mt-3 text-white/80">
            Your smart travel companion — plan trips, find routes, explore hotels,
            and get real-time safety updates.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-white/80">
            <li className="hover:text-white cursor-pointer transition">Home</li>
            <li className="hover:text-white cursor-pointer transition">Economical Packages</li>
            <li className="hover:text-white cursor-pointer transition">Premium Packages</li>
            <li className="hover:text-white cursor-pointer transition">Plan Your Trip</li>
            <li className="hover:text-white cursor-pointer transition">Weather Updates</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <p className="text-white/80">Email: support@travelease.com</p>
          <p className="text-white/80 mt-1">Phone: +92-300-1234567</p>

          <h3 className="text-xl font-semibold mt-5 mb-2">Follow Us</h3>
          <div className="flex gap-4 text-white text-2xl">
            <i className="fa-brands fa-facebook hover:text-gray-200 cursor-pointer"></i>
            <i className="fa-brands fa-instagram hover:text-gray-200 cursor-pointer"></i>
            <i className="fa-brands fa-twitter hover:text-gray-200 cursor-pointer"></i>
          </div>
        </div>

      </div>

      <div className="text-center text-white/70 mt-10 text-sm">
        © {new Date().getFullYear()} TravelEase. All rights reserved.
      </div>
    </footer>
  );
}
