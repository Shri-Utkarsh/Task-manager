import React, { useState } from "react";
import { auth } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="w-full sm:w-96 p-8 rounded-3xl bg-white shadow-xl shadow-purple-700/50 ">
        <h1 className="text-3xl font-bold text-center mb-4 text-purple-600">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative mb-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 pl-10 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600 transition-all"
            />
            <span className="absolute left-3 top-3 text-gray-500">✉️</span>
          </div>
          <div className="relative mb-5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 pl-10 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600 transition-all"
            />
            <span className="absolute left-3 top-3 text-gray-500">🔒</span>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl "
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-center text-purple-600 cursor-pointer mt-4"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Go to Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
