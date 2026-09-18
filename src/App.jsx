import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import BuyingGuide from "./pages/BuyingGuide";
import PreApproved from "./pages/PreApproved";
import BookAppointment from "./pages/BookAppointment";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import SingleWides from "./pages/SingleWides";
import DoubleWides from "./pages/DoubleWides";
import TinyHomes from "./pages/TinyHomes";
import WorkforceHousing from "./pages/WorkforceHousing";
import HomeDetail from "./pages/HomeDetail";

// Auth pages
import AdminLogin from "./pages/admin/auth/Login";
import AdminRegister from "./pages/admin/auth/Register";
import UserLogin from "./pages/user/auth/Login";
import UserRegister from "./pages/user/auth/Register";

// Protected components
import ProtectedRoute from "./components/ProtectedRoute";

// User Dashboard
import UserDashboard from "./pages/user/Dashboard";
import Overview from "./pages/user/Overview";
import Inquiries from "./pages/user/Inquiries";
import SavedHomes from "./pages/user/SavedHomes";
import Appointments from "./pages/user/Appointments";
import PreApproval from "./pages/user/PreApproval";
import Documents from "./pages/user/Documents";
import Profile from "./pages/user/Profile";
import BrowseHomes from "./pages/user/BrowseHomes";
import UserHomeDetail from "./pages/user/UserHomeDetail";
import NewInquiry from "./pages/user/NewInquiry";

// Admin Dashboard
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOverview from "./pages/admin/Overview";
import AdminHomes from "./pages/admin/Homes";
import AdminLeads from "./pages/admin/Leads";
import AdminAppointments from "./pages/admin/Appointments";
import AdminPreApprovals from "./pages/admin/AdminPreApprovals";
import AppointmentDetails from "./pages/admin/AppointmentDetails";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";

function App() {
  return (
    <Routes>
      {/* ===================== PUBLIC ===================== */}
      <Route path="/" element={<Home />} />
      <Route path="/buying-guide" element={<BuyingGuide />} />
      <Route path="/pre-approved" element={<PreApproved />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/homes/single-wides" element={<SingleWides />} />
      <Route path="/homes/double-wides" element={<DoubleWides />} />
      <Route path="/homes/tiny-homes" element={<TinyHomes />} />
      <Route path="/homes/workforce-housing" element={<WorkforceHousing />} />
      <Route path="/homes/:id" element={<HomeDetail />} />

      {/* ===================== AUTH ===================== */}
      <Route path="/login" element={<Navigate to="/user/login" replace />} />
      <Route path="/signup" element={<Navigate to="/user/register" replace />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />

      {/* ===================== USER DASHBOARD (Protected) ===================== */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Overview />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="homes" element={<BrowseHomes />} />
        <Route path="homes/:id" element={<UserHomeDetail />} />
        <Route path="saved" element={<SavedHomes />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="pre-approval" element={<PreApproval />} />
        <Route path="documents" element={<Documents />} />
        <Route path="profile" element={<Profile />} />
        <Route path="inquiries/new" element={<NewInquiry />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ===================== ADMIN DASHBOARD (Protected) ===================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="homes" element={<AdminHomes />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="appointments/:id" element={<AppointmentDetails />} />
        <Route path="pre-approvals" element={<AdminPreApprovals />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;