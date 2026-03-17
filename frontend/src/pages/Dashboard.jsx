import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { io } from "socket.io-client";

function Dashboard() {

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [profileImage, setProfileImage] = useState("");

  const [stats, setStats] = useState({
    totalSeats: 0,
    availableSeats: 0,
    myBookings: 0
  });

  const [activity, setActivity] = useState([]);

  // ================= SOCKET CONNECTION =================

  useEffect(() => {

    const socket = io("https://smart-library-seat-reservation-system.onrender.com");

    socket.on("activityFeed", (data) => {

      setActivity(prev => [data, ...prev.slice(0,4)]);

    });

    return () => {
      socket.disconnect();
    };

  }, []);

  // ================= LOAD DASHBOARD DATA =================

  useEffect(() => {

    if (!user) return;

    fetchDashboardStats();
    fetchProfileImage();

  }, [user]);



  // ================= PROFILE IMAGE =================

  const fetchProfileImage = async () => {

    try {

      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const res = await axios.get(
        `http://localhost:5000/api/auth/profile/${userId}`
      );

      if (res.data.profile_image) {

        setProfileImage(res.data.profile_image);

      }

    } catch {

      console.log("Error loading profile image");

    }

  };



  // ================= DASHBOARD STATS =================

  const fetchDashboardStats = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/bookings/dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats(res.data);

    } catch {

      console.log("Error loading dashboard stats");

    }

  };



  return (

    <div className="flex bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen text-white">

      <Sidebar />

      <div className="ml-64 flex-1 p-12 flex justify-center">

        <div className="w-full max-w-6xl">


          {/* ================= HEADER ================= */}

          <div className="flex justify-between items-center mb-12">

            <div>

              <h1 className="text-4xl font-bold mb-2">

                Welcome back,
                <span className="text-violet-400 ml-2">
                  {user?.first_name} {user?.last_name}
                </span>

              </h1>

              <p className="text-gray-400">
                Smart Library Seat Reservation System
              </p>

            </div>

            {profileImage && (

              <img
                src={`http://localhost:5000/uploads/${profileImage}`}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border-2 border-violet-500 shadow-lg"
              />

            )}

          </div>



          {/* ================= SCROLLING NOTICE ================= */}

          <div className="mb-10 overflow-hidden border border-blue-500 rounded-lg bg-blue-500/10 w-full">

            <div className="animate-marquee whitespace-nowrap text-yellow-300 py-3 px-4 font-medium">

              ⚠ Please update your details in your Personal Info section. Without completing your profile you will not be allowed to enter the library. If already updated please ignore.

            </div>

          </div>



          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">

            {/* Total Seats */}

            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-xl hover:scale-105 transition">

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-gray-400">
                  Total Seats
                </h3>

                <span className="text-2xl">🪑</span>

              </div>

              <p className="text-4xl font-bold">
                {stats.totalSeats}
              </p>

            </div>



            {/* Available Seats */}

            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-xl hover:scale-105 transition">

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-gray-400">
                  Available Seats
                </h3>

                <span className="text-2xl">✅</span>

              </div>

              <p className="text-4xl font-bold text-green-400">
                {stats.availableSeats}
              </p>

            </div>



            {/* My Bookings */}

            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-xl hover:scale-105 transition">

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-gray-400">
                  My Bookings
                </h3>

                <span className="text-2xl">📅</span>

              </div>

              <p className="text-4xl font-bold text-blue-400">
                {stats.myBookings}
              </p>

            </div>

          </div>



          {/* ================= QUICK ACTIONS ================= */}

          <h2 className="text-2xl font-bold mb-6">
            Quick Actions
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div
              onClick={() => navigate("/sections")}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-2xl cursor-pointer shadow-xl hover:scale-105 transition"
            >

              <h3 className="text-2xl font-bold mb-2">
                📚 Browse Sections
              </h3>

              <p className="text-blue-100">
                Explore library sections and reserve your seat easily.
              </p>

            </div>


            <div
              onClick={() => navigate("/bookings")}
              className="bg-gradient-to-br from-green-600 to-emerald-600 p-8 rounded-2xl cursor-pointer shadow-xl hover:scale-105 transition"
            >

              <h3 className="text-2xl font-bold mb-2">
                🪑 My Bookings
              </h3>

              <p className="text-green-100">
                View your current and past seat reservations.
              </p>

            </div>

          </div>



          {/* ================= LIVE ACTIVITY ================= */}

          <h2 className="text-2xl font-bold mt-14 mb-6">
            🔔 Live Library Activity
          </h2>


          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

            {activity.length === 0 && (

              <p className="text-gray-400">
                No recent activity
              </p>

            )}

            {activity.map((a,index)=> (

              <div
                key={index}
                className="flex justify-between border-b border-gray-800 py-3"
              >

                <p>

                  {a.action === "booked" && "🟢"}
                  {a.action === "cancelled" && "🔴"}

                  Seat {a.seat} {a.action}

                </p>

                <span className="text-gray-500 text-sm">

                  {a.timestamp
                    ? new Date(a.timestamp).toLocaleTimeString()
                    : "just now"}

                </span>

              </div>

            ))}

          </div>


        </div>

      </div>

    </div>

  );

}

export default Dashboard;
