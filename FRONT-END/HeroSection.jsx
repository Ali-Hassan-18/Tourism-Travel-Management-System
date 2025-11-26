import React from "react";
import backgroundImage from "../../assets/northern-pakistan.jpg";
import "../../Login.css"; // for smooth zoom animation

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Animated Background */}
      <div
        className="absolute inset-0 bg-cover bg-center animated-bg filter brightness-50"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
          Discover the Majesty of Northern Pakistan
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-white mb-10 max-w-3xl drop-shadow-md">
          Plan your journey, explore hidden gems, and create memories that last a lifetime.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105">
            Sign Up
          </button>
          <button className="bg-white text-teal-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transform transition hover:scale-105">
            Learn More
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg
            className="w-6 h-6 text-white mx-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
