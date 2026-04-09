const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// =======================================
// GET SEATS BY SECTION + DATE + TIME
// =======================================

router.get("/:sectionId/:date/:timeSlot", async (req, res) => {
  try {
    const { sectionId, date, timeSlot } = req.params;

    // Validate inputs
    if (!sectionId || !date || !timeSlot) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // MAIN QUERY
    const seats = await pool.query(
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
        AND b.date = $2
        AND b.time = $3
      WHERE s.section_id = $1
      ORDER BY s.seat_label ASC
      `,
      [sectionId, date, timeSlot]
    );

    res.status(200).json(seats.rows);

  } catch (err) {
    console.error("SEAT FETCH ERROR:", err.message);
    res.status(500).json({
      error: "Failed to fetch seats",
      details: err.message
    });
  }
});


// =======================================
// GET TOTAL SEAT COUNT PER SECTION
// =======================================

router.get("/section-counts", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        section_id, 
        COUNT(*) AS total_seats
      FROM seats
      GROUP BY section_id
      ORDER BY section_id
      `
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error("SECTION COUNT ERROR:", err.message);
    res.status(500).json({
      error: "Failed to fetch section counts",
      details: err.message
    });
  }
});


// =======================================
// OPTIONAL: SIMPLE TEST ROUTE (DEBUG)
// =======================================

router.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seats LIMIT 5");
    res.json(result.rows);
  } catch (err) {
    console.error("TEST ERROR:", err.message);
    res.status(500).json({ error: "Test failed" });
  }
});


module.exports = router;
