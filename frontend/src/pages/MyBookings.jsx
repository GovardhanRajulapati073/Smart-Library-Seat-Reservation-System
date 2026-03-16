import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { QRCodeCanvas } from "qrcode.react";
import { FaUserCircle } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function MyBookings() {

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [selectedCancelId, setSelectedCancelId] = useState(null);

  const passRef = useRef();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const userId = localStorage.getItem("userId");

      const res = await axios.get(
        `http://localhost:5000/api/bookings/user/${userId}`
      );

      setBookings(res.data);

    } catch (err) {

      console.error("Error fetching bookings:", err);

    }

  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
  };

  const formatDate = (date) => {

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  };

  // Check if booking expired

  const isBookingExpired = (booking) => {

    const now = new Date();
    const bookingDate = new Date(booking.booking_date);

    const slotEndTimes = {

      "9-11 AM": 11,
      "11-1 PM": 13,
      "2-4 PM": 16,
      "4-6 PM": 18

    };

    const endHour = slotEndTimes[booking.time_slot];

    bookingDate.setHours(endHour, 0, 0, 0);

    return now > bookingDate;

  };

  // Download PDF

  const downloadPDF = async () => {

    if (!passRef.current) return;

    try {

      const element = passRef.current;

      const canvas = await html2canvas(element, { scale: 2 });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);

      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;

      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);

      pdf.save(`Library_Pass_${localStorage.getItem("name")}.pdf`);

    } catch (err) {

      console.error("Error generating PDF:", err);

    }

  };

  // Confirm cancel booking

  const confirmCancelBooking = async () => {

    try {

      await axios.delete(
        `http://localhost:5000/api/bookings/cancel/${selectedCancelId}`
      );

      setShowConfirmPopup(false);

      setShowCancelSuccess(true);

      setBookings((prev) =>
        prev.filter((b) => b.id !== selectedCancelId)
      );

      setTimeout(() => {

        setShowCancelSuccess(false);

        setSelectedCancelId(null);

      }, 2000);

    } catch (err) {

      console.error("Error cancelling booking:", err);

    }

  };

  return (

    <div className="flex bg-gray-950 min-h-screen">

      <Sidebar />

      <div className="ml-64 p-10 w-full text-white">

        <h1 className="text-4xl font-bold mb-8">
          My Bookings
        </h1>

        <table className="w-full bg-gray-900 rounded-lg overflow-hidden">

          <thead>

            <tr className="border-b border-gray-700">

              <th className="p-4 text-left">Seat</th>

              <th className="p-4 text-left">Section</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Time Slot</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">View</th>

              <th className="p-4 text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {bookings.length > 0 ? (

              bookings.map((b) => (

                <tr
                  key={b.id}
                  className="border-b border-gray-800 hover:bg-gray-800"
                >

                  <td className="p-4">{b.seat_label}</td>

                  <td className="p-4">{b.section}</td>

                  <td className="p-4">
                    {formatDate(b.booking_date)}
                  </td>

                  <td className="p-4">{b.time_slot}</td>

                  {/* STATUS */}

                  <td className="p-4 font-semibold">

                    {isBookingExpired(b) ? (

                      <span className="text-red-400">
                        Expired
                      </span>

                    ) : (

                      <span className="text-green-400">
                        Confirmed
                      </span>

                    )}

                  </td>

                  {/* VIEW PASS */}

                  <td className="p-4">

                    {isBookingExpired(b) ? (

                      <span className="text-red-400 font-semibold">
                        Expired
                      </span>

                    ) : (

                      <button
                        onClick={() => handleView(b)}
                        className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-600 transition"
                      >
                        View
                      </button>

                    )}

                  </td>

                  {/* CANCEL */}

                  <td className="p-4">

                    {isBookingExpired(b) ? (

                      <button
                        disabled
                        className="bg-gray-500 px-4 py-2 rounded cursor-not-allowed"
                      >
                        Expired
                      </button>

                    ) : (

                      <button
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                        onClick={() => {

                          setSelectedCancelId(b.id);

                          setShowConfirmPopup(true);

                        }}
                      >
                        Cancel
                      </button>

                    )}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td className="p-4 text-center" colSpan="7">
                  No bookings found
                </td>

              </tr>

            )}

          </tbody>

        </table>


        {/* CANCEL CONFIRM POPUP */}

        {showConfirmPopup && (

          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">

            <div className="bg-gray-900 p-6 rounded-xl text-center w-80">

              <h2 className="text-xl font-bold mb-3 text-yellow-400">
                Confirm Cancellation
              </h2>

              <p className="mb-4">
                Are you sure you want to cancel this booking?
              </p>

              <div className="flex justify-center gap-4">

                <button
                  onClick={confirmCancelBooking}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes Cancel
                </button>

                <button
                  onClick={() => setShowConfirmPopup(false)}
                  className="bg-gray-600 px-4 py-2 rounded"
                >
                  No
                </button>

              </div>

            </div>

          </div>

        )}


        {/* CANCEL SUCCESS POPUP */}

        {showCancelSuccess && (

          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">

            <div className="bg-gray-900 p-8 rounded-xl text-center border border-red-500">

              <div className="text-red-500 text-5xl mb-3">
                ✖
              </div>

              <h2 className="text-xl font-bold text-red-400">
                Your booking has been cancelled
              </h2>

            </div>

          </div>

        )}


        {/* ACCESS PASS */}

        {selectedBooking && (

          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">

            <div
              ref={passRef}
              className="bg-gray-900 text-white p-8 rounded-xl w-96 text-center border border-gray-700"
            >

              <h2 className="text-2xl font-bold mb-4">
                Library Access Pass
              </h2>

              <FaUserCircle className="text-6xl mx-auto mb-2 text-blue-400" />

              <h3 className="text-xl font-semibold">
                {localStorage.getItem("name")}
              </h3>

              <p className="text-gray-400">
                {localStorage.getItem("email")}
              </p>

              <hr className="my-4 border-gray-700" />

              <p><b>Seat:</b> {selectedBooking.seat_label}</p>

              <p>
                <b>Date:</b>{" "}
                {formatDate(selectedBooking.booking_date)}
              </p>

              <p>
                <b>Time:</b> {selectedBooking.time_slot}
              </p>

              <p>
                <b>Role:</b> {localStorage.getItem("role")}
              </p>

              <div className="text-green-400 font-bold mt-3">
                ✔ Access Verified
              </div>

              <div className="flex justify-center mt-4">

                <QRCodeCanvas
                  value={`Name:${localStorage.getItem("name")}
Seat:${selectedBooking.seat_label}
Date:${selectedBooking.booking_date}
Time:${selectedBooking.time_slot}`}
                  size={120}
                />

              </div>

              <button
                onClick={downloadPDF}
                className="mt-4 w-full bg-green-500 py-2 rounded hover:bg-green-600"
              >
                Download Pass (PDF)
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="mt-3 w-full bg-red-500 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}

export default MyBookings;