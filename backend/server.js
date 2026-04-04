const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const seatRoutes = require("./routes/seatRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const server = http.createServer(app);

// ✅ YOUR FRONTEND URL
const FRONTEND_URL = "https://smart-library-seat-reservation-syst.vercel.app";

// ================= CORS FIX =================
app.use(cors({
  origin: [
    "http://localhost:5173",
    FRONTEND_URL
  ],
  credentials: true
}));

app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

// ================= SOCKET FIX =================
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      FRONTEND_URL
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// make io accessible in routes
app.set("io", io);

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

// ================= PORT FIX =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
