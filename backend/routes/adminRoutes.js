const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// =====================================================
// LIBRARY STATS
// =====================================================

router.get("/libraryStats", async (req,res)=>{

try{

const totalUsers = await pool.query(
"SELECT COUNT(*) FROM users"
);

const totalSeats = await pool.query(
"SELECT COUNT(*) FROM seats"
);

const totalBookings = await pool.query(
"SELECT COUNT(*) FROM bookings"
);

const occupiedSeats = await pool.query(`
SELECT COUNT(DISTINCT seat_id)
FROM bookings
WHERE status='booked'
`);

const availableSeats =
Number(totalSeats.rows[0].count) -
Number(occupiedSeats.rows[0].count);

res.json({

totalUsers: totalUsers.rows[0].count,
totalBookings: totalBookings.rows[0].count,
totalSeats: totalSeats.rows[0].count,
occupiedSeats: occupiedSeats.rows[0].count,
availableSeats

});

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// SECTION OCCUPANCY
// =====================================================

router.get("/sectionOccupancy", async(req,res)=>{

try{

const sections = await pool.query(`
SELECT 
sections.name as section,
COUNT(seats.id) as total_seats,
COUNT(bookings.id) FILTER (WHERE bookings.status='booked') as booked_seats,
COUNT(seats.id) -
COUNT(bookings.id) FILTER (WHERE bookings.status='booked') as available_seats
FROM sections
LEFT JOIN seats
ON seats.section_id = sections.id
LEFT JOIN bookings
ON bookings.seat_id = seats.id
GROUP BY sections.name
`);

res.json(sections.rows);

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// ROLE BOOKING STATS
// =====================================================

router.get("/bookingRoleStats", async(req,res)=>{

try{

const result = await pool.query(`
SELECT users.role,
COUNT(bookings.id) as total
FROM bookings
JOIN users ON bookings.user_id = users.id
WHERE bookings.status='booked'
GROUP BY users.role
`);

res.json(result.rows);

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// DAILY BOOKING TREND
// =====================================================

router.get("/dailyBookings", async(req,res)=>{

try{

const result = await pool.query(`
SELECT booking_date::date as date,
COUNT(*) as total
FROM bookings
GROUP BY date
ORDER BY date
`);

res.json(result.rows);

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// SECTION USAGE HEATMAP
// =====================================================

router.get("/sectionUsageHeatmap", async (req,res)=>{

try{

const result = await pool.query(`
SELECT 
sections.name AS section,
COUNT(seats.id) AS total_seats,
COUNT(bookings.id) FILTER (WHERE bookings.status='booked') AS booked_seats
FROM sections
LEFT JOIN seats
ON seats.section_id = sections.id
LEFT JOIN bookings
ON bookings.seat_id = seats.id
GROUP BY sections.name
`);

const data = result.rows.map(row=>{

const total = Number(row.total_seats);
const booked = Number(row.booked_seats);

return{
section:row.section,
total_seats:total,
booked_seats:booked,
usage_percent: total === 0
? 0
: Math.round((booked/total)*100)
};

});

res.json(data);

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// BOOKINGS BY ROLE
// =====================================================

router.get("/bookings/:role", async (req,res)=>{

try{

const role = req.params.role;

const bookings = await pool.query(`
SELECT 
bookings.id,
users.name,
users.email,
sections.name as section,
seats.seat_label,
bookings.booking_date,
bookings.time_slot,
bookings.status
FROM bookings
JOIN users ON bookings.user_id = users.id
JOIN seats ON bookings.seat_id = seats.id
JOIN sections ON seats.section_id = sections.id
WHERE users.role=$1
ORDER BY bookings.booking_date DESC
`,[role]);

res.json(bookings.rows);

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// DELETE BOOKING
// =====================================================

router.delete("/deleteBooking/:id", async(req,res)=>{

try{

await pool.query(
"DELETE FROM bookings WHERE id=$1",
[req.params.id]
);

res.json({message:"Booking deleted"});

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// USERS BY ROLE
// =====================================================

router.get("/users/:role", async(req,res)=>{

try{

const role = req.params.role;

const users = await pool.query(`
SELECT 
id,
name,
email,
first_name,
last_name,
mobile,
dob
FROM users
WHERE role=$1
ORDER BY id
`,[role]);

res.json(users.rows);

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// UPDATE USER
// =====================================================

router.put("/updateUser/:id", async(req,res)=>{

try{

const {name} = req.body;

await pool.query(
"UPDATE users SET name=$1 WHERE id=$2",
[name,req.params.id]
);

res.json({message:"User updated"});

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// DELETE USER
// =====================================================

router.delete("/deleteUser/:id", async(req,res)=>{

try{

await pool.query(
"DELETE FROM users WHERE id=$1",
[req.params.id]
);

res.json({message:"User deleted"});

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// SECTIONS BY ROLE
// =====================================================

router.get("/sections/:role", async(req,res)=>{

try{

const sections = await pool.query(
"SELECT id,name FROM sections WHERE type=$1",
[req.params.role]
);

res.json(sections.rows);

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// SEATS (WITH BOOKING STATUS)
// =====================================================

router.get("/seats/:role", async(req,res)=>{

try{

const role = req.params.role;
const section = req.query.section;

let query = `
SELECT 
seats.id,
seats.seat_label,
sections.name as section_name,
CASE
WHEN bookings.id IS NULL THEN 'available'
ELSE 'booked'
END as status
FROM seats
JOIN sections ON seats.section_id = sections.id
LEFT JOIN bookings
ON bookings.seat_id = seats.id
AND bookings.status='booked'
WHERE sections.type=$1
`;

let params=[role];

if(section){

query += " AND seats.section_id=$2";
params.push(section);

}

const seats = await pool.query(query,params);

res.json(seats.rows);

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// ADD SEAT
// =====================================================

router.post("/addSeat", async(req,res)=>{

try{

const {section_id,seat_label} = req.body;

await pool.query(
"INSERT INTO seats(section_id,seat_label) VALUES($1,$2)",
[section_id,seat_label]
);

res.json({message:"Seat added"});

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


// =====================================================
// DELETE SEAT
// =====================================================

router.delete("/deleteSeat/:id", async(req,res)=>{

try{

await pool.query(
"DELETE FROM seats WHERE id=$1",
[req.params.id]
);

res.json({message:"Seat deleted"});

}catch(err){

console.log(err.message);
res.status(500).json({error:"Server Error"});

}

});


module.exports = router;