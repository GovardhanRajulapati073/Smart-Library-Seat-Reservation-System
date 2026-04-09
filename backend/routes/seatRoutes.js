const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// =======================================
// ✅ TEST ROUTE (CHECK DB CONNECTION)
// =======================================
router.get("/test", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM seats LIMIT 5");
    res.json(data.rows);
  } catch (err) {
    console.error("TEST ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// =======================================
// ✅ GET SEATS BY SECTION / DATE / TIMESLOT
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
    console.error("🔥 SEAT FETCH ERROR:", err);
    res.status(500).json({
      error: "Failed to fetch seats",
      details: err.message
    });
  }
});


// =======================================
// ✅ GET SEAT COUNTS FOR EACH SECTION
// =======================================
router.get("/section-counts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        section_id, 
        COUNT(*) AS total_seats
      FROM seats
      GROUP BY section_id
      ORDER BY section_id
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("🔥 COUNT ERROR:", err);
    res.status(500).json({
      error: "Failed to fetch section counts",
      details: err.message
    });
  }
});


// =======================================
// ✅ OPTIONAL: GET ALL SEATS (DEBUG)
// =======================================
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM seats ORDER BY id
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("🔥 ALL SEATS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
