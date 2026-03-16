import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SeatLayout from "./pages/SeatLayout";
import AdminDashboard from "./pages/AdminDashboard";
import MyBookings from "./pages/MyBookings";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Sections from "./pages/Sections";
import Profile from "./pages/Profile";
import LibraryID from "./pages/LibraryID";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/seats/:sectionId" element={<SeatLayout />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
        <Route path="/Sections" element={<Sections/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/library-id" element={<LibraryID />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;



