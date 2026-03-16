import { useState } from "react";
import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setMessage("");
    setError(false);

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address");
      setError(true);
      return;
    }

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      const token = res.data.token;

      window.location.href = `/reset-password/${token}`;

    } catch (err) {

      setMessage(
        err.response?.data?.message || "User not found"
      );
      setError(true);

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4">

      <div className="w-full max-w-md">

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl animate-fade"
        >

          <h2 className="text-2xl font-semibold text-white text-center">
            Reset your password
          </h2>

          <p className="text-gray-400 text-sm text-center mt-2 mb-6">
            Enter your registerd email 
          </p>

          {/* Email Input */}
          <div className="mb-5">

            <label className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
            />

          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition
            ${loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
            }`}
          >

            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}

            {loading ? "Sending..." : "Send Reset Link"}

          </button>

          {/* Error Message */}
          {message && (
            <div
              className={`mt-5 flex items-center gap-2 p-3 rounded-lg border text-sm
              ${error
                ? "bg-red-500/10 border-red-500 text-red-400 animate-shake"
                : "bg-green-500/10 border-green-500 text-green-400"
              }`}
            >
              <span className="text-lg">
                {error ? "❌" : "✔"}
              </span>
              {message}
            </div>
          )}

        </form>

      </div>

      {/* Animations */}
      <style>
        {`
        @keyframes fade {
          from {
            opacity:0;
            transform:translateY(15px);
          }
          to {
            opacity:1;
            transform:translateY(0);
          }
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }

        .animate-fade {
          animation: fade 0.5s ease;
        }

        .animate-shake {
          animation: shake 0.35s ease;
        }
        `}
      </style>

    </div>
  );

}

export default ForgotPassword;