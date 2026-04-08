const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// =======================================
// GET SEATS BY SECTION / DATE / TIMESLOT
// =======================================

router.get("/:sectionId/:date/:timeSlot", async (req, res) => {
  try {
    const { sectionId, date, timeSlot } = req.params;

    const seats = await pool.query(
      `
      SELECT 
        seats.id,
        seats.seat_label,
        CASE
          WHEN bookings.id IS NULL THEN 'available'
          ELSE 'booked'
        END AS status
      FROM seats
      LEFT JOIN bookings
        ON seats.id = bookings.seat_id
        AND bookings.booking_date = $2
        AND bookings.time_slot = $3
        AND bookings.status = 'booked'
      WHERE seats.section_id = $1
      ORDER BY seats.seat_label
      `,
      [sectionId, date, timeSlot]
    );

    res.json(seats.rows);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// =======================================
// GET SEAT COUNTS FOR SECTIONS
// =======================================

router.get("/section-counts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT section_id, COUNT(*) AS count
      FROM seats
      GROUP BY section_id
      ORDER BY section_id
    `);

    res.json(result.rows);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
