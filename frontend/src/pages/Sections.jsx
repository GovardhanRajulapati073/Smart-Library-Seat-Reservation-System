import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Sections() {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [seatCounts, setSeatCounts] = useState({});

  useEffect(() => {

    const fetchSeatCounts = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/seats/section-counts"
        );

        const counts = {};

        res.data.forEach(item => {
          counts[item.section_id] = item.count;
        });

        setSeatCounts(counts);

      } catch (err) {

        console.error("Error loading seat counts", err);

      }

    };

    fetchSeatCounts();

  }, []);


  const sections = role === "faculty"
    ? [
        {
          id: 4,
          name: "Faculty Room",
          icon: "👨‍🏫",
          description: "Reserved seating for faculty members",
          color: "from-purple-600 to-indigo-600"
        }
      ]
    : [
        {
          id: 1,
          name: "E-Library",
          icon: "💻",
          description: "Digital resources and computer access",
          color: "from-blue-600 to-cyan-600"
        },
        {
          id: 2,
          name: "Study Cabins",
          icon: "📚",
          description: "Quiet individual study cabins",
          color: "from-green-600 to-emerald-600"
        },
        {
          id: 3,
          name: "Reading Area",
          icon: "🪑",
          description: "Open reading hall with desks",
          color: "from-orange-500 to-red-500"
        }
      ];

  return (

    <div className="flex bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen text-white">

      <Sidebar />

      <div className="ml-64 flex-1 p-12">

        {/* Page Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold mb-2">
            Library Sections
          </h1>

          <p className="text-gray-400">
            Choose a section to reserve your seat
          </p>

        </div>


        {/* Section Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {sections.map((section) => (

            <div
              key={section.id}
              onClick={() => navigate(`/seats/${section.id}`)}
              className={`relative overflow-hidden bg-gray-900/60 backdrop-blur-lg border border-gray-800
              p-8 rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl
              transition transform hover:scale-105 group`}
            >

              {/* Gradient Glow */}

              <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${section.color}`}></div>

              {/* Icon */}

              <div className="text-5xl mb-4">
                {section.icon}
              </div>

              {/* Title */}

              <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition">
                {section.name}
              </h2>

              {/* Description */}

              <p className="text-gray-400 mb-6">
                {section.description}
              </p>

              {/* Seat Count */}

              <div className="flex justify-between items-center">

                <span className="text-sm text-gray-400">
                  Total Seats
                </span>

                <span className="text-xl font-bold text-green-400">
                  {seatCounts[section.id] || 0}
                </span>

              </div>

              {/* Hover Arrow */}

              <div className="absolute bottom-4 right-4 text-gray-400 group-hover:text-white transition">
                →
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default Sections;