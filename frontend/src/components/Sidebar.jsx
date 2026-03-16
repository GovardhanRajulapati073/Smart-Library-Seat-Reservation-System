import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(UserContext);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ACTIVE MENU COLOR (LIGHT BLUE)
  const activeClass = "w-full text-left px-4 py-2 rounded bg-sky-500";

  const normalClass =
    "w-full text-left px-4 py-2 rounded hover:bg-gray-800";

  return (

    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 p-6">

      {/* PROFILE BADGE */}

      <div className="text-center mb-10 border-b border-gray-700 pb-6">

        <img
          src={
            user?.profile_image
              ? `http://localhost:5000/uploads/${user.profile_image}`
              : "https://i.imgur.com/6VBx3io.png"
          }
          className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-gray-700"
          alt="Profile"
        />

        <p className="mt-3 font-semibold text-lg">
          {user?.first_name} {user?.last_name}
        </p>

        {/* STUDENT INFO */}
        {user?.role === "student" && (
          <p className="text-gray-400 text-sm">
            {user?.branch}
            {user?.specialization && ` - ${user?.specialization}`}
            <br />
            {user?.year}
          </p>
        )}

        {/* FACULTY INFO */}
        {user?.role === "faculty" && (
          <p className="text-gray-400 text-sm">
            Faculty
            <br />
            Emp ID: {user?.emp_id}
          </p>
        )}

      </div>


      {/* MENU */}

      <div className="space-y-3">

        <button
          onClick={() => navigate("/dashboard")}
          className={
            location.pathname === "/dashboard"
              ? activeClass
              : normalClass
          }
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/sections")}
          className={
            location.pathname === "/sections"
              ? activeClass
              : normalClass
          }
        >
          Sections
        </button>

        <button
          onClick={() => navigate("/bookings")}
          className={
            location.pathname === "/bookings"
              ? activeClass
              : normalClass
          }
        >
          My Bookings
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={
            location.pathname === "/profile"
              ? activeClass
              : normalClass
          }
        >
          Personal Info
        </button>

        <button
          onClick={() => navigate("/library-id")}
          className={
            location.pathname === "/library-id"
              ? activeClass
              : normalClass
          }
        >
          Library ID
        </button>

        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 rounded bg-red-500 hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </div>

  );
}

export default Sidebar;