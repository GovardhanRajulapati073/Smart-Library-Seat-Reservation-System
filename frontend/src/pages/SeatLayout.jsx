import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Socket connection
const socket = io("https://smart-library-seat-reservation-system.onrender.com");

function SeatLayout() {

  const { sectionId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingSeat, setBookingSeat] = useState(null);

  const [showConfirmBooking, setShowConfirmBooking] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showClosedPopup, setShowClosedPopup] = useState(false);

  const username = localStorage.getItem("name");

  // =============================
  // Disable expired time slots
  // =============================

  const isSlotDisabled = (slot) => {

    const today = new Date().toISOString().split("T")[0];

    if (selectedDate !== today) return false;

    const currentHour = new Date().getHours();

    const slotEndTimes = {
      "9-11 AM": 11,
      "11-1 PM": 13,
      "2-4 PM": 16,
      "4-6 PM": 18,
    };

    return currentHour >= slotEndTimes[slot];

  };

  // =============================
  // Fetch seats
  // =============================

  const fetchSeats = async () => {

    if (!selectedDate || !timeSlot) return;

    try {

      setLoading(true);

      const res = await axios.get(
        `https://smart-library-seat-reservation-system.onrender.com/api/seats/${sectionId}/${selectedDate}/${timeSlot}`
      );

      setSeats(res.data);

    } catch (error) {

      console.error("Error fetching seats:", error);

    } finally {

      setLoading(false);

    }

  };

  // Load seats when selection changes

  useEffect(() => {

    fetchSeats();

  }, [sectionId, selectedDate, timeSlot]);

  // =============================
  // REAL TIME SEAT UPDATES
  // =============================

  useEffect(() => {

    socket.on("newBooking", (data) => {

      if (
        data.booking_date === selectedDate &&
        data.time_slot === timeSlot
      ) {
        fetchSeats();
      }

    });

    return () => socket.off("newBooking");

  }, [selectedDate, timeSlot]);

  // =============================
  // Confirm Booking
  // =============================

  const confirmBooking = async () => {

    try {

      const userId = localStorage.getItem("userId");

      if (!selectedSeat || !selectedDate || !timeSlot) {
        alert("Please select date and time slot first");
        return;
      }

      setBookingSeat(selectedSeat.id);

      await axios.post(
        "https://smart-library-seat-reservation-system.onrender.com/api/bookings/book",
        {
          user_id: userId,
          seat_id: selectedSeat.id,
          booking_date: selectedDate,
          time_slot: timeSlot,
        }
      );

      setShowConfirmBooking(false);
      setShowBookingSuccess(true);

      fetchSeats();

    } catch (error) {

      console.error(error.response?.data || error.message);

      alert("Booking failed. Please try again.");

    } finally {

      setBookingSeat(null);

    }

  };

  // =============================
  // Seat Click
  // =============================

  const handleSeatClick = (seat) => {

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    if (!timeSlot) {
      alert("Please select a time slot first");
      return;
    }

    if (seat.status === "booked") return;

    const today = new Date().toISOString().split("T")[0];

    const currentHour = new Date().getHours();

    const slotEndTimes = {
      "9-11 AM": 11,
      "11-1 PM": 13,
      "2-4 PM": 16,
      "4-6 PM": 18,
    };

    if (selectedDate === today && currentHour >= slotEndTimes[timeSlot]) {

      setShowClosedPopup(true);
      return;

    }

    setSelectedSeat(seat);
    setShowConfirmBooking(true);

  };

  return (

    <div className="min-h-screen bg-gray-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-8 text-center">
        Seat Layout — Section {sectionId}
      </h1>


      {/* Date Selector */}

      <div className="flex flex-col items-center mb-6">

        <h2 className="text-xl mb-2">Select Date</h2>

        <input
          type="date"
          className="p-2 bg-gray-800 rounded"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

      </div>


      {/* Time Slots */}

      <h2 className="text-xl text-center mb-3">Select Timings</h2>

      <div className="flex gap-4 justify-center mb-6">

        {["9-11 AM","11-1 PM","2-4 PM","4-6 PM"].map((slot) => (

          <button
            key={slot}
            disabled={isSlotDisabled(slot)}
            title={isSlotDisabled(slot) ? "Slot expired for today" : ""}
            onClick={() => setTimeSlot(slot)}
            className={`px-4 py-2 rounded
              ${timeSlot === slot ? "bg-blue-500" : "bg-gray-700"}
              ${isSlotDisabled(slot) ? "opacity-40 cursor-not-allowed" : ""}
            `}
          >
            {slot.replace("-", " – ")}
          </button>

        ))}

      </div>


      {/* Legend */}

      <div className="flex justify-center gap-6 mb-6">

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          Available
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          Booked
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          Booking...
        </div>

      </div>


      {/* Loading */}

      {loading && (

        <div className="flex justify-center mb-6">

          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>

        </div>

      )}


      {/* Seat Grid */}

      {!loading && (

        <div
          className="grid gap-4 justify-center"
          style={{ gridTemplateColumns: "repeat(8,60px)" }}
        >

          {seats.map((seat) => {

            const isBooked = seat.status === "booked";
            const isBooking = bookingSeat === seat.id;

            let color = "bg-green-500";

            if (isBooked) color = "bg-red-500";
            if (isBooking) color = "bg-yellow-400";

            return (

              <div
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold
                transition-all duration-300 transform
                ${color}
                ${isBooking ? "animate-pulse" : ""}
                ${
                  isBooked || isBooking
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }`}
              >
                {isBooking ? "..." : seat.seat_label}
              </div>

            );

          })}

        </div>

      )}


      {/* Booking Confirmation Popup */}

      {showConfirmBooking && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">

          <div className="bg-gray-900 p-6 rounded-xl text-center w-80">

            <h2 className="text-xl font-bold mb-3 text-yellow-400">
              Confirm Booking
            </h2>

            <p className="mb-4">
              Do you want to book seat <b>{selectedSeat?.seat_label}</b> ?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={confirmBooking}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                Yes Book
              </button>

              <button
                onClick={() => setShowConfirmBooking(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}


      {/* Booking Success Popup */}

      {showBookingSuccess && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">

          <div className="bg-gray-900 p-8 rounded-xl text-center">

            <div className="text-green-500 text-5xl mb-3">✔</div>

            <h2 className="text-xl font-bold text-green-400 mb-4">
              Seat booked successfully!
            </h2>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => navigate("/bookings")}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              >
                View Bookings
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Go to Dashboard
              </button>

            </div>

          </div>

        </div>

      )}


      {/* Closed Popup */}

      {showClosedPopup && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/60">

          <div className="bg-gray-900 p-8 rounded-xl text-center border border-red-500">

            <div className="text-red-500 text-5xl mb-4">❌</div>

            <h2 className="text-xl font-bold text-red-400 mb-2">
              Library Timings Closed
            </h2>

            <p className="text-gray-300">
              Cannot book this slot as library timings are closed.
            </p>

            <button
              onClick={() => setShowClosedPopup(false)}
              className="mt-4 bg-red-500 px-6 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default SeatLayout;
