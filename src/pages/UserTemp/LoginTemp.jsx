import React, { useState } from "react";
import backgroundImage from "../../assets/northern-pakistan.jpg";
import "./Login.css";
import { useNavigate } from "react-router-dom";

// Firebase Imports
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from "firebase/auth";

// Firebase Configuration (DO NOT CHANGE)
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

// Temporary Admin Credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

const LoginTemporary = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); 
  
  const [isLogin, setIsLogin] = useState(true); 

  const navigate = useNavigate();
  
  const resetForm = () => {
      setEmail('');
      setPassword('');
      setFullName('');
  };
  
  const handleToggleMode = () => {
      setIsLogin(!isLogin); 
      resetForm();         
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        
        // 1. Check for Admin Credentials
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            console.log("Admin Login Successful!"); // Using console.log to avoid alert box shift
            resetForm();
            navigate("/admin-dashboard");
        } 
        
        // 2. Regular User Login (Executed only if not Admin)
        else {
            await signInWithEmailAndPassword(auth, email, password);
            console.log(`Regular Login Successful!`); // Using console.log to avoid alert box shift
            resetForm();
            navigate("/dashboard");
        }
        
      } else {
        // --- SIGN UP LOGIC ---
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Sign Up Successful!"); // Using console.log to avoid alert box shift
        resetForm();
        navigate("/dashboard");
      }
    } catch (error) {
        // 🛑 Error is now handled silently in console to prevent layout shift.
        // You should implement a small status message component here later.
        console.error("Authentication Failed:", error.code);
        // Note: For now, the user must look at the console for the error.
    }
  };

  const goHome = () => {
    navigate("/");
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  // Dynamic Text for UI
  const titleText = isLogin ? "Welcome Back!" : "Create Your Account";
  const buttonText = isLogin ? "Log In" : "Sign Up";
  const toggleText = isLogin ? "New user? Create an account" : "Already have an account? Log In";


  return (
    <div className="login-container">
      <div
        className="animated-bg"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Using custom CSS class for sizing */}
      <div className="login-card login-card-size flex w-11/12 overflow-hidden rounded-3xl shadow-2xl">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {/* Using custom CSS class for padding */}
          <div className="absolute top-0 left-0 w-full login-panel-padding text-white">
            <h1 className="text-4xl font-bold mb-4">ENJOY YOUR JOURNEY</h1>
            <p className="mb-6 text-lg">
              Explore the most beautiful places in Northern Pakistan
            </p>
          </div>
          
          {/* Using custom CSS class for padding */}
          <div className="absolute bottom-0 left-0 w-full login-panel-padding text-white">
            <p className="mb-6 text-lg leading-relaxed">
              From peaceful valleys to high peaks, experience landscapes that
              redefine beauty. Your journey begins with a single step.
            </p>
            <p className="text-sm italic">
              Nature’s masterpiece — waiting for you to discover.
            </p>
          </div>
        </div>

        {/* Using custom CSS class for padding */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-teal-500 to-blue-500 login-panel-padding flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {titleText}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Field Wrapper for Stability */}
            <div 
                className={`full-name-field-wrapper ${isLogin ? 'is-login-mode' : ''}`}
            >
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>

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
              placeholder={isLogin ? "Password" : "Create Password (Min 6 chars)"}
              className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 bg-white text-teal-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              {buttonText}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <button 
              className="text-white text-sm mt-4 hover:underline"
              onClick={handleToggleMode}
          >
              {toggleText}
          </button>

          <div className="mt-8 text-center text-white flex flex-col space-y-3">
            <button className="btn-secondary" onClick={handleGoogleSignIn}>
              {isLogin ? "Log in with Google" : "Sign up with Google"}
            </button>
            
            <button className="btn-secondary" onClick={goHome}>Home Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTemporary;