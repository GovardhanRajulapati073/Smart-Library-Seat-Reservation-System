const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// =======================================
// ✅ TEST ROUTE
// =======================================
router.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seats LIMIT 5");
    res.json(result.rows);
  } catch (err) {
    console.error("TEST ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// =======================================
// ✅ GET SEATS WITH BOOKING STATUS
// =======================================
router.get("/:sectionId/:date/:timeSlot", async (req, res) => {
  try {
    const { sectionId, date, timeSlot } = req.params;

    console.log("➡️ Fetching seats:", { sectionId, date, timeSlot });

    const result = await pool.query(
      `
      SELECT 
        s.id,
        s.seat_label,
        CASE 
          WHEN b.id IS NULL THEN 'available'
          ELSE 'booked'
        END AS status
      FROM seats s
      LEFT JOIN bookings b 
        ON s.id = b.seat_id
        AND b.booking_date = $2
        AND b.time_slot = $3
        AND b.status = 'booked'
      WHERE s.section_id = $1
      ORDER BY s.id
      `,
      [sectionId, date, timeSlot]
    );

    console.log("✅ Seats fetched:", result.rows.length);

    res.json(result.rows);

  } catch (err) {
    console.error("🔥 SEAT ERROR:", err);
    res.status(500).json({
      error: "Failed to fetch seats",
      details: err.message
    });
  }
});


// =======================================
// ✅ CREATE BOOKING (VERY IMPORTANT)
// =======================================
router.post("/book", async (req, res) => {
  try {
    const { user_id, seat_id, booking_date, time_slot } = req.body;

    // Check if seat already booked
    const existing = await pool.query(
      `
      SELECT * FROM bookings
      WHERE seat_id = $1
      AND booking_date = $2
      AND time_slot = $3
      AND status = 'booked'
      `,
      [seat_id, booking_date, time_slot]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Seat already booked" });
    }

    // Insert booking
    const result = await pool.query(
      `
      INSERT INTO bookings (user_id, seat_id, booking_date, time_slot, status)
      VALUES ($1, $2, $3, $4, 'booked')
      RETURNING *
      `,
      [user_id, seat_id, booking_date, time_slot]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("🔥 BOOKING ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =======================================
// ✅ GET SECTION SEAT COUNTS
// =======================================
router.get("/section-counts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        section_id, 
        COUNT(*)::int AS count   -- ✅ rename + fix type
      FROM seats
      GROUP BY section_id
      ORDER BY section_id
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("COUNT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
