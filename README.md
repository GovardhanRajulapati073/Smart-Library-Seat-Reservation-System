# 📚 Smart Library Seat Reservation System

A full-stack web application that enables students and faculty to **reserve library seats in real-time**, manage bookings, and monitor occupancy with an interactive admin dashboard.

---

## 🚀 Live Demo

* 🌐 Frontend (Vercel):
  https://smart-library-seat-reservation-syst.vercel.app

* ⚙️ Backend (Render):
  https://smart-library-seat-reservation-system.onrender.com

---

## ✨ Features

### 👤 User Features

* 🔐 Secure Login & Registration (Student / Faculty)
* 📅 Seat Booking by Date & Time Slot
* 🪑 Real-time Seat Availability
* ❌ Cancel Bookings
* 🧾 Digital Library ID with QR Code
* 🔄 Forgot & Reset Password

---

### 🛠️ Admin Features

* 👥 Manage Users (View, Update, Delete)
* 📖 Manage Bookings
* 🪑 Seat Management (Add/Delete Seats)
* 📊 Library Occupancy Dashboard (Charts & Stats)
* 📡 Live Activity Monitor (Real-time updates)

---

### ⚡ Real-Time Features

* 🔄 Live seat updates using **Socket.IO**
* 📢 Activity feed (Booked / Cancelled / Expired)

---

## 🧑‍💻 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router
* Chart.js
* Socket.IO Client

### Backend

* Node.js
* Express.js
* PostgreSQL
* Socket.IO
* JWT Authentication

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: PostgreSQL (Render / Supabase)

---

## 📂 Project Structure

```
smart-library-seat-reservation/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── context/
│
├── backend/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-library-seat-reservation.git
cd smart-library-seat-reservation
```

---

### 🔹 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

### 🔹 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)

```
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
```

---

## 📡 API Endpoints (Sample)

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Seats

* GET `/api/seats/:sectionId/:date/:timeSlot`

### Bookings

* POST `/api/bookings/book`
* DELETE `/api/bookings/cancel/:id`

### Admin

* GET `/api/admin/users/:role`
* GET `/api/admin/bookings/:role`

---

## 📊 Key Functionalities

* ✔ Seat Lock System (30 sec temporary lock)
* ✔ Auto-expire bookings based on time
* ✔ Role-based access (Student / Faculty / Admin)
* ✔ Real-time synchronization across users

---

## 🐞 Common Issues & Fixes

| Issue                 | Solution                            |
| --------------------- | ----------------------------------- |
| CORS Error            | Check backend `FRONTEND_URL`        |
| 404 on refresh        | Add `vercel.json`                   |
| 500 error             | Verify database connection          |
| Socket not connecting | Replace localhost with deployed URL |

---

## 📌 Future Enhancements

* 📱 Mobile app version
* 📊 Advanced analytics dashboard
* 🔔 Email notifications for bookings
* 🧠 AI-based seat recommendations

---

## 👨‍💻 Author's

**Govardhan Sai Ganesh Rajulapati, BG Sreevani, M Sai Pallavi**
B.Tech CSE (Data Science)

---

## ⭐ Acknowledgements

* React Documentation
* Express.js
* PostgreSQL
* Socket.IO

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Contribution

Feel free to fork, improve, and submit pull requests!

---

🔥 *If you like this project, give it a ⭐ on GitHub!*
