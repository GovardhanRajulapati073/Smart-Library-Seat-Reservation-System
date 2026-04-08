import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {

  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);

  const [strength, setStrength] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  const checkStrength = (pass) => {

    let score = 0;

    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) {
      setStrength("Weak");
      setStrengthColor("bg-red-500");
    } 
    else if (score === 2 || score === 3) {
      setStrength("Medium");
      setStrengthColor("bg-yellow-500");
    } 
    else {
      setStrength("Strong");
      setStrengthColor("bg-green-500");
    }

  };


  const checkPasswords = (pass, confirm) => {

    if (!confirm) {
      setPasswordMatch(null);
      return;
    }

    if (pass === confirm) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const res = await axios.post(
        `https://smart-library-seat-reservation-system.onrender.com/api/auth/reset-password/${token}`,
        { password }
      );

      setSuccess(true);
      setMessage(res.data.message || "Password updated successfully");

      setPassword("");
      setConfirmPassword("");
      setPasswordMatch(null);
      setStrength("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2500);

    } catch (err) {

      const errorMsg =
        err.response?.data?.message || "Reset failed";

      setMessage(errorMsg);
      setSuccess(false);

    }

    setLoading(false);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4">

      <div className="w-full max-w-md">

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 p-8 rounded-2xl shadow-2xl text-white"
        >

          <div className="text-center mb-6">

            <h2 className="text-2xl font-bold">
              Reset Password
            </h2>

            <p className="text-gray-400 text-sm">
              Enter your new secure password
            </p>

          </div>


          {/* Password */}
          <div className="relative mb-3">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkStrength(e.target.value);
                checkPasswords(e.target.value, confirmPassword);
              }}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>


          {/* Strength Meter */}
          {password && (
            <div className="mb-3">

              <div className="w-full h-2 bg-gray-700 rounded">

                <div
                  className={`h-2 rounded transition-all duration-300 ${strengthColor}`}
                  style={{
                    width:
                      strength === "Weak"
                        ? "33%"
                        : strength === "Medium"
                        ? "66%"
                        : "100%"
                  }}
                ></div>

              </div>

              <p className="text-xs mt-1 text-gray-400">
                Strength: {strength}
              </p>

            </div>
          )}


          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              checkPasswords(password, e.target.value);
            }}
            required
            className="w-full p-3 mb-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 outline-none"
          />


          {/* Match Indicator */}
          {passwordMatch !== null && (

            <p
              className={`text-sm mb-2 ${
                passwordMatch
                  ? "text-green-400"
                  : "text-red-400 animate-pulse"
              }`}
            >

              {passwordMatch
                ? "✔ Passwords match"
                : "❌ Passwords do not match"}

            </p>

          )}


          {/* Button */}
          <button
            type="submit"
            disabled={loading || passwordMatch === false}
            className={`w-full py-3 rounded-lg font-medium flex justify-center items-center gap-2
            ${
              loading || passwordMatch === false
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >

            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}

            {loading ? "Updating..." : "Update Password"}

          </button>


          {/* Message */}
          {message && (

            <div
              className={`mt-5 text-sm text-center
              ${success ? "text-green-400" : "text-red-400"}
              `}
            >

              {success && (
                <div className="flex justify-center mb-2">

                  <svg
                    className="w-10 h-10 text-green-400 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                </div>
              )}

              {message}

            </div>

          )}

        </form>

      </div>

    </div>
  );
}

export default ResetPassword;
