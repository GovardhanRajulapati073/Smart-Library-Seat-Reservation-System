import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function LibraryID() {

  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({});

  useEffect(() => {

    axios
      .get(`https://smart-library-seat-reservation-system.onrender.com/api/auth/profile/${userId}`)
      .then((res) => {
        setUser(res.data);
      });

  }, []);

  const downloadCard = async () => {

    const element = document.getElementById("id-card");

    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      scale: 2
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 180;

    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 15, 20, imgWidth, imgHeight);

    pdf.save("Library_ID_Card.pdf");

  };

  return (

    <div className="flex bg-gray-950 min-h-screen text-white">

      <Sidebar />

      <div className="ml-64 flex-1 p-10">

        <h1 className="text-3xl font-bold mb-8">
          Digital Library ID Card
        </h1>

        <div className="flex justify-center">

          <div
            id="id-card"
            className="bg-white text-black w-[420px] p-6 rounded-2xl shadow-xl"
          >

            {/* HEADER */}

            <div className="text-center border-b pb-3 mb-4">

              <h2 className="text-xl font-bold tracking-wide">
                SMART LIBRARY
              </h2>

              <p className="text-sm text-gray-600">
                University Seat Reservation System
              </p>

            </div>


            {/* PROFILE PHOTO */}

            <div className="flex justify-center mb-4">

              {user.profile_image && (

                <img
                  crossOrigin="anonymous"
                  src={`https://smart-library-seat-reservation-system.onrender.com/uploads/${user.profile_image}`}
                  className="w-28 h-28 rounded-full border-4 border-gray-300 object-cover"
                  alt="profile"
                />

              )}

            </div>


            {/* USER NAME */}

            <h3 className="text-center text-lg font-semibold">

              {user.first_name} {user.last_name}

            </h3>

            <p className="text-center text-gray-500 mb-4">

              {user.role}

            </p>


            {/* USER DETAILS */}

            <div className="text-sm space-y-1">

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              {user.hall_ticket && (

                <p>
                  <strong>Hall Ticket:</strong> {user.hall_ticket}
                </p>

              )}

              {user.emp_id && (

                <p>
                  <strong>Employee ID:</strong> {user.emp_id}
                </p>

              )}

              {user.branch && (

                <p>
                  <strong>Branch:</strong> {user.branch}
                </p>

              )}

              {user.specialization && (

                <p>
                  <strong>Specialization:</strong> {user.specialization}
                </p>

              )}

              {user.year && (

                <p>
                  <strong>Year:</strong> {user.year}
                </p>

              )}

              {user.mobile && (

                <p>
                  <strong>Mobile:</strong> {user.mobile}
                </p>

              )}

              {user.dob && (

                <p>
                  <strong>DOB:</strong>{" "}
                  {new Date(user.dob).toLocaleDateString()}
                </p>

              )}

            </div>


            {/* QR CODE */}

            <div className="flex justify-center mt-6">

              <QRCodeCanvas
                value={`USER:${user.id}`}
                size={130}
              />

            </div>

            <p className="text-center text-xs text-gray-500 mt-2">
              Scan QR for Library Access
            </p>

          </div>

        </div>


        {/* DOWNLOAD BUTTON */}

        <div className="flex justify-center">

          <button
            onClick={downloadCard}
            className="mt-8 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg"
          >
            Download ID Card
          </button>

        </div>

      </div>

    </div>

  );

}

export default LibraryID;
