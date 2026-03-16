import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [registered, setRegistered] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role
      });

      setRegistered(true);
    } catch (err) {
      alert("Registration failed");
    }
  };

  useEffect(() => {
    if (registered) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [registered, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Register
        </h2>

        {/* Student / Faculty selector */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setRole("student")}
            className={`px-4 py-2 rounded ${
              role === "student" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            Student Register
          </button>

          <button
            onClick={() => setRole("faculty")}
            className={`px-4 py-2 rounded ${
              role === "faculty" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            Faculty Register
          </button>
        </div>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 bg-gray-800 rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-gray-800 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-gray-800 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 p-3 rounded hover:bg-blue-600"
          onClick={handleRegister}
        >
          Register
        </button>

        {registered && (
          <p className="text-green-400 mt-4 text-center">
            Registration successful. Redirecting to login...
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;