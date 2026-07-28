import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeDetail from "./pages/BikeDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Profile from "./pages/Profile";
import MyRentals from "./pages/MyRentals";
import RentalCallback from "./pages/RentalCallback";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ProtectedRoute, AdminRoute } from "./lib/protected-routes";
import { paths } from "./config/paths";

import AdminLayout from "./layout/adminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBikes from "./pages/admin/AdminBikes";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path={paths.home} element={<SiteLayout><Home /></SiteLayout>} />
      <Route path={paths.bikes} element={<SiteLayout><Bikes /></SiteLayout>} />
      <Route path="/bikes/:id" element={<SiteLayout><BikeDetail /></SiteLayout>} />
      <Route path={paths.login} element={<SiteLayout><Login /></SiteLayout>} />
      <Route path={paths.register} element={<SiteLayout><Register /></SiteLayout>} />
      <Route path={paths.forgotPassword} element={<SiteLayout><Forgot /></SiteLayout>} />
      <Route path={paths.resetPassword} element={<SiteLayout><Forgot /></SiteLayout>} />
      <Route path={paths.about} element={<SiteLayout><About /></SiteLayout>} />
      <Route path={paths.contact} element={<SiteLayout><Contact /></SiteLayout>} />
      <Route path={paths.rentalCallback} element={<SiteLayout><RentalCallback /></SiteLayout>} />

      <Route element={<ProtectedRoute />}>
        <Route path={paths.profile} element={<SiteLayout><Profile /></SiteLayout>} />
        <Route path={paths.myRentals} element={<SiteLayout><MyRentals /></SiteLayout>} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path={paths.admin} element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bikes" element={<AdminBikes />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
