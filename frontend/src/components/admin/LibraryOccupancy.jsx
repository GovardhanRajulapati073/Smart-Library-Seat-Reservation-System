import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import { Pie, Bar, Line } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
BarElement,
LineElement,
CategoryScale,
LinearScale,
PointElement,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
ArcElement,
BarElement,
LineElement,
CategoryScale,
LinearScale,
PointElement,
Tooltip,
Legend
);

function LibraryOccupancy(){

const [stats,setStats] = useState({});
const [sections,setSections] = useState([]);
const [roleStats,setRoleStats] = useState([]);
const [dailyStats,setDailyStats] = useState([]);
const [heatmap,setHeatmap] = useState([]);
const [activity,setActivity] = useState([]);

/* ======================= SOCKET ======================= */

useEffect(()=>{

const socket = io("https://smart-library-seat-reservation-system.onrender.com");

socket.on("activityFeed",(data)=>{

setActivity(prev=>[data,...prev.slice(0,6)]);

});

socket.on("statsUpdate",()=>{

fetchStats();
fetchSections();
fetchRoleStats();
fetchDailyStats();
fetchHeatmap();

});

return ()=>socket.disconnect();

},[]);


/* ======================= API CALLS ======================= */

const fetchStats = async()=>{
const res = await axios.get("https://smart-library-seat-reservation-system.onrender.com/api/admin/libraryStats");
setStats(res.data);
};

const fetchSections = async()=>{
const res = await axios.get("https://smart-library-seat-reservation-system.onrender.com/api/admin/sectionOccupancy");
setSections(res.data);
};

const fetchRoleStats = async()=>{
const res = await axios.get("https://smart-library-seat-reservation-system.onrender.com/api/admin/bookingRoleStats");
setRoleStats(res.data);
};

const fetchDailyStats = async()=>{
const res = await axios.get("https://smart-library-seat-reservation-system.onrender.com/api/admin/dailyBookings");
setDailyStats(res.data);
};

const fetchHeatmap = async()=>{
const res = await axios.get("https://smart-library-seat-reservation-system.onrender.com/api/admin/sectionUsageHeatmap");
setHeatmap(res.data);
};


/* ======================= EFFECT ======================= */

useEffect(()=>{

fetchStats();
fetchSections();
fetchRoleStats();
fetchDailyStats();
fetchHeatmap();

},[]);


/* ======================= OCCUPANCY % ======================= */

const occupancyPercent = stats.totalSeats
? Math.round((stats.occupiedSeats / stats.totalSeats) * 100)
: 0;


/* ======================= CHART DATA ======================= */

const pieData = {
labels: sections.map(sec => sec.section),
datasets:[
{
label:"Booked Seats",
data: sections.map(sec => Number(sec.booked_seats)),
backgroundColor:[
"#3B82F6",
"#10B981",
"#F59E0B",
"#EF4444",
"#8B5CF6"
]
}
]
};

const barData = {
labels: roleStats.map(r=>r.role),
datasets:[
{
label:"Bookings",
data: roleStats.map(r=>Number(r.total)),
backgroundColor:["#3B82F6","#10B981"]
}
]
};

const lineData = {
labels: dailyStats.map(d=>d.date),
datasets:[
{
label:"Daily Bookings",
data: dailyStats.map(d=>Number(d.total)),
borderColor:"#F59E0B",
backgroundColor:"#F59E0B",
fill:false,
tension:0.3
}
]
};


/* ======================= CHART OPTIONS ======================= */

const chartOptions = {
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{
labels:{color:"#E5E7EB"}
}
},
scales:{
x:{
ticks:{color:"#E5E7EB"},
grid:{color:"#374151"}
},
y:{
ticks:{color:"#E5E7EB"},
grid:{color:"#374151"}
}
}
};


return(

<div className="max-w-7xl mx-auto p-6">

<h2 className="text-2xl mb-6 text-white font-semibold">
Library Occupancy Dashboard
</h2>


{/* ======================= STAT CARDS ======================= */}

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">

<div className="bg-gray-900 p-6 rounded-xl text-center shadow">
<h3 className="text-2xl text-white">{stats.totalUsers}</h3>
<p className="text-gray-400">Users</p>
</div>

<div className="bg-gray-900 p-6 rounded-xl text-center shadow">
<h3 className="text-2xl text-white">{stats.totalBookings}</h3>
<p className="text-gray-400">Bookings</p>
</div>

<div className="bg-gray-900 p-6 rounded-xl text-center shadow">
<h3 className="text-2xl text-white">{stats.totalSeats}</h3>
<p className="text-gray-400">Total Seats</p>
</div>

<div className="bg-green-600 p-6 rounded-xl text-center shadow">
<h3 className="text-2xl">{stats.availableSeats}</h3>
<p>Available</p>
</div>

<div className="bg-red-700 p-6 rounded-xl text-center shadow">
<h3 className="text-2xl">{stats.occupiedSeats}</h3>
<p>Occupied</p>
</div>

<div className="bg-blue-600 p-6 rounded-xl text-center shadow">
<h3 className="text-2xl">{occupancyPercent}%</h3>
<p>Occupancy</p>
</div>

</div>



{/* ======================= SECTION TABLE ======================= */}

<h3 className="text-lg mb-4 text-white font-semibold">
Section Occupancy
</h3>

<div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg mb-10">

<table className="w-full text-gray-200 text-sm">

<thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
<tr>
<th className="p-4 text-left">Section</th>
<th className="p-4 text-center">Total</th>
<th className="p-4 text-center">Booked</th>
<th className="p-4 text-center">Available</th>
</tr>
</thead>

<tbody>

{sections.map((sec)=>{

const bookedColor =
sec.booked_seats === 0
? "bg-green-500/20 text-green-400"
: "bg-yellow-500/20 text-yellow-400";

const availableColor =
sec.available_seats === 0
? "bg-red-500/20 text-red-400"
: "bg-green-500/20 text-green-400";

return(

<tr
key={sec.section}
className="border-b border-gray-700 hover:bg-gray-800 transition"
>

<td className="p-4 font-medium text-white">
{sec.section}
</td>

<td className="p-4 text-center">
{sec.total_seats}
</td>

<td className="p-4 text-center">
<span className={`px-3 py-1 rounded-full text-xs ${bookedColor}`}>
{sec.booked_seats}
</span>
</td>

<td className="p-4 text-center">
<span className={`px-3 py-1 rounded-full text-xs ${availableColor}`}>
{sec.available_seats}
</span>
</td>

</tr>

);

})}

</tbody>

</table>

</div>



{/* ======================= CHART GRID ======================= */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

<div className="bg-gray-900 p-6 rounded-xl">
<h3 className="mb-4 text-lg text-white font-semibold">
Section Booking Distribution
</h3>
<div style={{height:"300px"}}>
<Pie data={pieData} options={chartOptions}/>
</div>
</div>


<div className="bg-gray-900 p-6 rounded-xl">
<h3 className="mb-4 text-lg text-white font-semibold">
Student vs Faculty Bookings
</h3>
<div style={{height:"300px"}}>
<Bar data={barData} options={chartOptions}/>
</div>
</div>


<div className="bg-gray-900 p-6 rounded-xl">
<h3 className="mb-4 text-lg text-white font-semibold">
Daily Booking Trend
</h3>
<div style={{height:"300px"}}>
<Line data={lineData} options={chartOptions}/>
</div>
</div>

</div>



{/* ======================= HEATMAP ======================= */}

<div className="mt-12">

<h3 className="text-lg mb-4 text-white">
Library Section Usage Heatmap
</h3>

<div className="space-y-4">

{heatmap.map(section=>{

let color="bg-green-500";

if(section.usage_percent>70) color="bg-red-500";
else if(section.usage_percent>40) color="bg-yellow-500";

return(

<div key={section.section}>

<div className="flex justify-between mb-1 text-gray-300">
<span>{section.section}</span>
<span>{section.usage_percent}%</span>
</div>

<div className="w-full bg-gray-800 rounded">

<div
className={`${color} h-4 rounded`}
style={{width:`${section.usage_percent}%`}}
></div>

</div>

</div>

);

})}

</div>

</div>

</div>

);

}

export default LibraryOccupancy;
