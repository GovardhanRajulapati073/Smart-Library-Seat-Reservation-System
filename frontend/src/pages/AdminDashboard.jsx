import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ManageUsers from "../components/admin/ManageUsers";
import ManageBookings from "../components/admin/ManageBookings";
import SeatManagement from "../components/admin/SeatManagement";
import LibraryOccupancy from "../components/admin/LibraryOccupancy";
import AdminActivityMonitor from "../components/admin/AdminActivityMonitor";

function AdminDashboard() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getButtonClass = (tab, defaultColor) => {
    return `px-5 py-2 rounded font-semibold transition 
    ${activeTab === tab ? "bg-blue-500" : defaultColor}`;
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">

      {/* HEADER */}

      <div className="flex justify-between items-center bg-gray-900 px-10 py-4 shadow-lg sticky top-0 z-50">

        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-5 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>


      {/* NAVIGATION BUTTONS */}

      <div className="flex justify-center items-center gap-6 p-8 flex-wrap">

        <button
          onClick={() => setActiveTab("users")}
          className={getButtonClass("users","bg-green-500 hover:bg-green-600")}
        >
          Manage Users
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={getButtonClass("bookings","bg-purple-500 hover:bg-purple-600")}
        >
          Manage Bookings
        </button>

        <button
          onClick={() => setActiveTab("seats")}
          className={getButtonClass("seats","bg-yellow-500 hover:bg-yellow-600 text-black")}
        >
          Seat Management
        </button>

        <button
          onClick={() => setActiveTab("occupancy")}
          className={getButtonClass("occupancy","bg-pink-500 hover:bg-pink-600")}
        >
          Library Occupancy
        </button>

        {/* NEW ACTIVITY TAB */}

        <button
          onClick={() => setActiveTab("activity")}
          className={getButtonClass("activity","bg-indigo-500 hover:bg-indigo-600")}
        >
          Live Activity
        </button>

      </div>


      {/* CONTENT AREA */}

      <div className="p-6 max-w-7xl mx-auto">

        {activeTab === "users" && <ManageUsers />}

        {activeTab === "bookings" && <ManageBookings />}

        {activeTab === "seats" && <SeatManagement />}

        {activeTab === "occupancy" && <LibraryOccupancy />}

        {activeTab === "activity" && <AdminActivityMonitor />}

      </div>

    </div>
  );
}

export default AdminDashboard;