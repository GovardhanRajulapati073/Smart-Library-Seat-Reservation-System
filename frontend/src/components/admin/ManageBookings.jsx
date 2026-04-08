import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function ManageBookings() {

  const [bookings, setBookings] = useState([]);
  const [role, setRole] = useState("student");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const socket = io("https://smart-library-seat-reservation-system.onrender.com");

  useEffect(() => {
    fetchBookings();
  }, [role]);


  // ================= LIVE UPDATES =================

  useEffect(() => {

    socket.on("statsUpdate", () => {
      fetchBookings();
    });

    socket.on("activityFeed", () => {
      fetchBookings();
    });

    return () => socket.disconnect();

  }, []);


  // ================= FETCH BOOKINGS =================

  const fetchBookings = async () => {

    try {

      const res = await axios.get(
        `https://smart-library-seat-reservation-system.onrender.com/api/admin/bookings/${role}`
      );

      setBookings(res.data);

    } catch (error) {

      console.error("Error fetching bookings:", error);

    }

  };


  // ================= DELETE BOOKING =================

  const deleteBooking = async (id) => {

    const confirm = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirm) return;

    try {

      await axios.delete(
        `https://smart-library-seat-reservation-system.onrender.com/api/admin/deleteBooking/${id}`
      );

      fetchBookings();

    } catch (error) {

      console.error("Error deleting booking:", error);

    }

  };


  // ================= DATE FORMAT =================

  const formatDate = (date) => {

    if (!date) return "N/A";

    const parsed = new Date(date);

    if (isNaN(parsed)) return "Invalid Date";

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  };


  // ================= FILTER BOOKINGS =================

  const filteredBookings = bookings.filter((b) => {

  if (!selectedDate) return false;

  const matchSearch =
  b.name.toLowerCase().includes(search.toLowerCase()) ||
  b.email.toLowerCase().includes(search.toLowerCase());

  const matchDate =
    new Date(b.booking_date).toISOString().split("T")[0] === selectedDate;

  return matchSearch && matchDate;

});


  return (

    <div className="p-6">

      <h2 className="text-2xl font-semibold mb-6 text-white">
        Booking Management
      </h2>


      {/* ROLE FILTER */}

      <div className="flex gap-4 mb-6">

        <button
          onClick={() => setRole("student")}
          className={`px-5 py-2 rounded-lg font-medium transition
          ${
            role === "student"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
          }`}
        >
          Student Bookings
        </button>

        <button
          onClick={() => setRole("faculty")}
          className={`px-5 py-2 rounded-lg font-medium transition
          ${
            role === "faculty"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
          }`}
        >
          Faculty Bookings
        </button>

      </div>


      {/* SEARCH + DATE FILTER */}

      <div className="flex gap-4 mb-6 flex-wrap">

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-900 text-white p-3 rounded-lg w-full md:w-1/2 border border-gray-700"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-white-900 text-black p-3 rounded-lg border border-gray-700"
        />

        {selectedDate && (

          <button
            onClick={() => setSelectedDate("")}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Clear
          </button>

        )}

      </div>


      {/* TABLE */}

      <div className="overflow-x-auto rounded-xl shadow-lg">

        <table className="w-full bg-gray-900 text-gray-200">

          <thead className="bg-gray-800 text-gray-300 text-sm uppercase">

            <tr>

              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Section</th>
              <th className="p-4 text-left">Seat</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Time Slot</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>

            </tr>

          </thead>


          <tbody>

            {filteredBookings.map((b) => (

              <tr
                key={b.id}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >

                <td className="p-4">{b.name}</td>

                <td className="p-4 text-gray-400">
                  {b.email}
                </td>

                <td className="p-4">
                  {b.section}
                </td>

                <td className="p-4 font-semibold text-yellow-400">
                  {b.seat_label}
                </td>

                <td className="p-4">
                  {formatDate(b.booking_date)}
                </td>

                <td className="p-4">
                  {b.time_slot}
                </td>


                {/* STATUS */}

                <td className="p-4">

                  {b.status === "expired" ? (

                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs">
                      Expired
                    </span>

                  ) : (

                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                      Active
                    </span>

                  )}

                </td>


                {/* DELETE */}

                <td className="p-4 text-center">

                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-white"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default ManageBookings;
