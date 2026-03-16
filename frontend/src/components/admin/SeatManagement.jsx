import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function SeatManagement() {

const [sections,setSections] = useState([]);
const [seats,setSeats] = useState([]);
const [sectionId,setSectionId] = useState("");
const [seatLabel,setSeatLabel] = useState("");
const [role,setRole] = useState("student");
const [selectedSection,setSelectedSection] = useState("");

const socket = io("http://localhost:5000");

useEffect(()=>{
fetchSections();
fetchSeats();
},[role]);


// ================= LIVE UPDATES =================

useEffect(()=>{

socket.on("statsUpdate",()=>{
fetchSeats(selectedSection);
});

socket.on("activityFeed",()=>{
fetchSeats(selectedSection);
});

return ()=>socket.disconnect();

},[selectedSection]);



// ================= FETCH SECTIONS =================

const fetchSections = async()=>{

try{

const res = await axios.get(
`http://localhost:5000/api/admin/sections/${role}`
);

setSections(res.data);

}catch(err){

console.error(err);

}

};


// ================= FETCH SEATS =================

const fetchSeats = async(section="")=>{

try{

let url = `http://localhost:5000/api/admin/seats/${role}`;

if(section){
url += `?section=${section}`;
}

const res = await axios.get(url);

setSeats(res.data);

}catch(err){

console.error(err);

}

};



// ================= ADD SEAT =================

const addSeat = async()=>{

if(!sectionId || !seatLabel){

alert("Please select section and seat label");
return;

}

try{

await axios.post(
"http://localhost:5000/api/admin/addSeat",
{
section_id: sectionId,
seat_label: seatLabel
}
);

setSeatLabel("");

fetchSeats(selectedSection);

}catch(err){

console.error(err);
alert("Error adding seat");

}

};



// ================= DELETE SEAT =================

const deleteSeat = async(id)=>{

const confirm = window.confirm(
"Are you sure you want to delete this seat?"
);

if(!confirm) return;

try{

await axios.delete(
`http://localhost:5000/api/admin/deleteSeat/${id}`
);

fetchSeats(selectedSection);

}catch(err){

console.error(err);
alert("Delete failed");

}

};



return(

<div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex justify-center py-10">

<div className="w-[1100px] bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl">


{/* ================= TITLE ================= */}

<h2 className="text-3xl font-bold mb-8 text-center tracking-wide">
Seat Management
</h2>



{/* ================= ROLE TOGGLE ================= */}

<div className="flex gap-4 justify-center mb-8">

<button
onClick={()=>{
setRole("student");
setSelectedSection("");
}}
className={`px-6 py-2 rounded-full font-semibold transition
${role==="student"
? "bg-blue-600 shadow-lg shadow-blue-600/30"
: "bg-gray-800 hover:bg-gray-700"}
`}
>
🎓 Student Sections
</button>

<button
onClick={()=>{
setRole("faculty");
setSelectedSection("");
}}
className={`px-6 py-2 rounded-full font-semibold transition
${role==="faculty"
? "bg-purple-600 shadow-lg shadow-purple-600/30"
: "bg-gray-800 hover:bg-gray-700"}
`}
>
👨‍🏫 Faculty Sections
</button>

</div>



{/* ================= SECTION FILTER ================= */}

<div className="flex flex-wrap justify-center gap-3 mb-8">

<button
onClick={()=>{
setSelectedSection("");
fetchSeats("");
}}
className={`px-4 py-2 rounded-lg font-semibold
${selectedSection===""
? "bg-blue-600"
: "bg-gray-800 hover:bg-gray-700"}
`}
>
All
</button>

{sections.map(s=>(
<button
key={s.id}
onClick={()=>{
setSelectedSection(s.id);
fetchSeats(s.id);
}}
className={`px-4 py-2 rounded-lg font-semibold
${selectedSection==s.id
? "bg-blue-600"
: "bg-gray-800 hover:bg-gray-700"}
`}
>
{s.name}
</button>
))}

</div>



{/* ================= LEGEND ================= */}

<div className="flex gap-8 justify-center mb-6">

<div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
<div className="w-4 h-4 bg-green-500 rounded"></div>
<span>Available</span>
</div>

<div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
<div className="w-4 h-4 bg-red-500 rounded"></div>
<span>Booked</span>
</div>

</div>



{/* ================= SEAT GRID ================= */}

<div
className="grid gap-4 justify-center"
style={{
gridTemplateColumns:"repeat(auto-fill,60px)"
}}
>

{seats.map(seat => (

<div
key={seat.id}
className={`relative w-14 h-14 flex items-center justify-center rounded-xl font-bold cursor-pointer
transition transform hover:scale-110 hover:shadow-xl
${seat.status === "booked"
? "bg-red-500 shadow-red-500/30"
: "bg-green-500 shadow-green-500/30"}
`}
>

{seat.seat_label}

<button
onClick={()=>deleteSeat(seat.id)}
className="absolute -top-2 -right-2 text-xs bg-black px-1 rounded-full hover:bg-red-600"
>
✖
</button>

</div>

))}

</div>



{/* ================= ADD SEAT PANEL ================= */}

<div className="mt-12 bg-gray-800/60 border border-gray-700 rounded-xl p-6">

<h3 className="text-xl font-semibold mb-6 text-center">
Add Seats to Section
</h3>

<div className="flex justify-center gap-4 flex-wrap">

<select
value={sectionId}
onChange={(e)=>setSectionId(e.target.value)}
className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg"
>

<option value="">
Select Section
</option>

{sections.map(s=>(
<option key={s.id} value={s.id}>
{s.name}
</option>
))}

</select>


<input
type="text"
placeholder="Seat Label (A1,B2)"
value={seatLabel}
onChange={(e)=>setSeatLabel(e.target.value)}
className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg"
/>


<button
onClick={addSeat}
className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold transition"
>
+ Add Seat
</button>

</div>

</div>



</div>
</div>

);

}

export default SeatManagement;