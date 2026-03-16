import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("student");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      const res = await API.post("/auth/login", {
        email,
        password
      });

      // Role validation
      if (
        res.data.role.toLowerCase() !== loginType &&
        res.data.role.toLowerCase() !== "admin"
      ) {
        alert("Please login with correct role");
        return;
      }

      // Save user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("role", res.data.role);

      // Redirect
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {

      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Login failed");
      }

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">

      <div className="bg-gray-900 p-8 rounded-xl w-96 shadow-xl">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Login
        </h2>

        {/* Login Type Buttons */}
        <div className="flex mb-6 bg-gray-800 rounded-lg overflow-hidden">

          <button
            onClick={() => setLoginType("student")}
            className={`flex-1 py-2 font-medium transition duration-200
              ${
                loginType === "student"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
          >
            Student Login
          </button>

          <button
            onClick={() => setLoginType("faculty")}
            className={`flex-1 py-2 font-medium transition duration-200
              ${
                loginType === "faculty"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
          >
            Faculty Login
          </button>

        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          className="w-full bg-blue-500 p-3 rounded font-semibold hover:bg-blue-600 transition duration-200"
          onClick={handleLogin}
        >
          Login
        </button>

        {/* Forgot Password */}
        <p className="text-sm mt-3 text-gray-400 text-center">
          Forgot Password?
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-blue-400 cursor-pointer ml-1 hover:underline"
          >
            Click here
          </span>
        </p>

        {/* Register */}
        <p className="text-center mt-4 text-gray-400">
          Not registered?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Click here to register
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;