const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // ✅ FIXED (use bcryptjs)
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const crypto = require("crypto");
const multer = require("multer");
 

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {

    let { name, email, password, role } = req.body;

    // ✅ VALIDATION (VERY IMPORTANT)
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, Email and Password are required"
      });
    }

    if (!role) {
      role = "student";
    }

    // ✅ CHECK EXISTING USER
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ INSERT USER
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role]
    );

    res.status(201).json(newUser.rows[0]);

  } catch (err) {
    console.log("REGISTER ERROR:", err); // ✅ FULL ERROR
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // ✅ VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required"
      });
    }

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "User not registered"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        role: user.rows[0].role
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      userId: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      role: user.rows[0].role
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await pool.query(
      "UPDATE users SET reset_token=$1 WHERE email=$2",
      [token, email]
    );

    res.json({
      message: "Reset token generated",
      token
    });

  } catch (err) {
    console.log("FORGOT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= RESET PASSWORD =================
router.post("/reset-password/:token", async (req, res) => {
  try {

    const { password } = req.body;
    const token = req.params.token;

    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    const user = await pool.query(
      "SELECT * FROM users WHERE reset_token=$1",
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password=$1, reset_token=NULL WHERE reset_token=$2",
      [hashedPassword, token]
    );

    res.json({
      message: "Password updated successfully"
    });

  } catch (err) {
    console.log("RESET ERROR:", err);
    res.status(500).json({ message: "Reset failed" });
  }
});


// ================= GET USER PROFILE =================
router.get("/profile/:id", async (req, res) => {
  try {

    const user = await pool.query(
      "SELECT * FROM users WHERE id=$1",
      [req.params.id]
    );

    res.json(user.rows[0]);

  } catch (err) {
    console.log("PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE PROFILE =================
router.put("/profile/:id", upload.single("profile_image"), async (req, res) => {
  try {

    const {
      first_name,
      last_name,
      hall_ticket,
      emp_id,
      mobile,
      dob,
      branch,
      specialization,
      year
    } = req.body;

    let profile_image = null;

    if (req.file) {
      profile_image = req.file.filename;
    }

    await pool.query(
      `UPDATE users
       SET first_name=$1,
           last_name=$2,
           hall_ticket=$3,
           emp_id=$4,
           mobile=$5,
           dob=$6,
           branch=$7,
           specialization=$8,
           year=$9,
           profile_image = COALESCE($10, profile_image)
       WHERE id=$11`,
      [
        first_name,
        last_name,
        hall_ticket,
        emp_id,
        mobile,
        dob,
        branch,
        specialization,
        year,
        profile_image,
        req.params.id
      ]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
