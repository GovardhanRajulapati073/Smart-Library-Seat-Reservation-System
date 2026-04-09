const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");


// =====================================
// SEAT LOCK SYSTEM (30 seconds)
// =====================================

const seatLocks = new Map();

router.post("/lock-seat", (req, res) => {

  const { seat_id } = req.body;

  if (seatLocks.has(seat_id)) {
    return res.status(400).json({
      message: "Seat temporarily locked by another user"
    });
  }

  seatLocks.set(seat_id, Date.now());

  setTimeout(() => {
    seatLocks.delete(seat_id);
  }, 30000);

  res.json({ message: "Seat locked for 30 seconds" });

});


// =====================================
// AUTO EXPIRE BOOKINGS
// =====================================

const expireBookings = async () => {

  await pool.query(`
    UPDATE bookings
    SET status='expired'
    WHERE status='booked'
    AND (
      booking_date < CURRENT_DATE
      OR
      (booking_date = CURRENT_DATE AND
       CASE
         WHEN time_slot = '9-11 AM' THEN '11:00'
         WHEN time_slot = '11-1 PM' THEN '13:00'
         WHEN time_slot = '2-4 PM' THEN '16:00'
         WHEN time_slot = '4-6 PM' THEN '18:00'
       END::time < CURRENT_TIME
      )
    )
  `);

};


// =====================================
// BOOK SEAT
// =====================================

router.post("/book", async (req, res) => {

  try {

    const { user_id, seat_id, booking_date, time_slot } = req.body;

    if (!user_id || !seat_id || !booking_date || !time_slot) {
      return res.status(400).json({ message: "Missing booking data" });
    }

    await expireBookings();

    // seat lock check
    if (seatLocks.has(seat_id)) {

      const lockTime = seatLocks.get(seat_id);

      if (Date.now() - lockTime < 30000) {
        return res.status(400).json({
          message: "Seat temporarily locked"
        });
      } else {
        seatLocks.delete(seat_id);
      }

    }

    // check existing booking
    const existing = await pool.query(
      `SELECT * FROM bookings
       WHERE seat_id=$1
       AND booking_date=$2
       AND time_slot=$3
       AND status='booked'`,
      [seat_id, booking_date, time_slot]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Seat already booked for this time slot"
      });
    }

    // create booking
    const booking = await pool.query(
      `INSERT INTO bookings
       (user_id, seat_id, booking_date, status, time_slot)
       VALUES ($1,$2,$3,'booked',$4)
       RETURNING *`,
      [user_id, seat_id, booking_date, time_slot]
    );

    // unlock seat
    seatLocks.delete(seat_id);

    // get seat label
    const seatInfo = await pool.query(
      "SELECT seat_label FROM seats WHERE id=$1",
      [seat_id]
    );

    const seatLabel = seatInfo.rows[0].seat_label;

    const io = req.app.get("io");

    if (io) {

      // refresh seat layout
      io.emit("newBooking", booking.rows[0]);

      // activity feed
      io.emit("activityFeed", {
        seat: seatLabel,
        action: "booked",
        timestamp: new Date()
      });

    }

    res.json(booking.rows[0]);

  } catch (err) {

    console.log(err.message);
    res.status(500).send("Booking failed");

  }

});


// =====================================
// CANCEL BOOKING
// =====================================

router.delete("/cancel/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM bookings WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const seat_id = result.rows[0].seat_id;

    const seatInfo = await pool.query(
      "SELECT seat_label FROM seats WHERE id=$1",
      [seat_id]
    );

    const seatLabel = seatInfo.rows[0].seat_label;

    const io = req.app.get("io");

    if (io) {

      io.emit("newBooking");

      io.emit("activityFeed", {
        seat: seatLabel,
        action: "cancelled",
        timestamp: new Date()
      });

    }

    res.json({
      message: "Booking cancelled",
      cancelled: result.rows[0]
    });

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: "Server error" });

  }

});


// =====================================
// GET USER BOOKINGS
// =====================================

router.get("/user/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    await expireBookings();

    const bookings = await pool.query(`
      SELECT bookings.id,
             seats.seat_label,
             sections.name AS section,
             bookings.time_slot,
             bookings.booking_date,
             bookings.status
      FROM bookings
      JOIN seats ON bookings.seat_id = seats.id
      JOIN sections ON seats.section_id = sections.id
      WHERE bookings.user_id = $1
      ORDER BY bookings.booking_date DESC
    `, [userId]);

    res.json(bookings.rows);

  } catch (err) {

    console.log(err.message);
    res.status(500).json({ error: "Server error" });

  }

});


// =====================================
// DASHBOARD STATS
// =====================================

router.get("/dashboard-stats", async (req, res) => {
  try {

    await expireBookings();

    // ✅ get userId safely (no JWT dependency issue)
    const userId = req.headers.userid || req.query.userId;

    // TOTAL SEATS
    const totalSeats = await pool.query(
      "SELECT COUNT(*) FROM seats"
    );

    // BOOKED SEATS (TODAY)
    const bookedSeats = await pool.query(
      `
      SELECT COUNT(*) FROM bookings
      WHERE status = 'booked'
      AND booking_date = CURRENT_DATE
      `
    );

    // MY BOOKINGS
    let myBookings = { rows: [{ count: 0 }] };

    if (userId) {
      myBookings = await pool.query(
        `
        SELECT COUNT(*) FROM bookings
        WHERE user_id = $1
        AND status IN = ('booked' , 'confirmed')
        `,
        [userId]
      );
    }

    res.json({
      totalSeats: Number(totalSeats.rows[0].count),
      availableSeats:
        Number(totalSeats.rows[0].count) -
        Number(bookedSeats.rows[0].count),
      myBookings: Number(myBookings.rows[0].count)
    });

  } catch (err) {
    console.log("Dashboard Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
