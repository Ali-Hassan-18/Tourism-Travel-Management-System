import React, { useState } from "react";
import backgroundImage from "../../assets/northern-pakistan.jpg";
import "./Login.css";
import { useNavigate } from "react-router-dom";

// Firebase Imports
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0e1YlT_2Q45jAVn56nseiqsbrEkXiTIs",
  authDomain: "touristguide-981c3.firebaseapp.com",
  projectId: "touristguide-981c3",
  storageBucket: "touristguide-981c3.firebasestorage.app",
  messagingSenderId: "278221111218",
  appId: "1:278221111218:web:c0002701461744ad762eab",
  measurementId: "G-NMC2XYZ9DX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const LoginTemporary = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Removed alert, just navigate
    navigate("/dashboard");
  };

  const goHome = () => {
    navigate("/");
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Google Sign-in Successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Google Sign-in Failed");
    }
  };

  return (
    <div className="login-container">
      <div
        className="animated-bg"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="login-card flex w-11/12 max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute top-0 left-0 w-full p-10 text-white">
            <h1 className="text-4xl font-bold mb-4">ENJOY YOUR JOURNEY</h1>
            <p className="mb-6 text-lg">
              Explore the most beautiful places in Northern Pakistan
            </p>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-10 text-white">
            <p className="mb-6 text-lg leading-relaxed">
              From peaceful valleys to high peaks, experience landscapes that
              redefine beauty. Your journey begins with a single step.
            </p>
            <p className="text-sm italic">
              Nature’s masterpiece — waiting for you to discover.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gradient-to-br from-teal-500 to-blue-500 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Create Password"
              className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 bg-white text-teal-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Continue
            </button>
          </form>

          <div className="mt-6 text-center text-white flex flex-col gap-3">
            <button className="btn-secondary" onClick={handleGoogleSignIn}>
              Sign up with Google
            </button>
            <button className="btn-secondary" onClick={goHome}>Home Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTemporary;
