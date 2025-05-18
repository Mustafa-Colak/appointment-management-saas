import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { tr } from "date-fns/locale";
import { useTranslation } from 'react-i18next';

// i18n konfigürasyonu
import './i18n';

import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { theme } from "./config/theme";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { checkAuth } from "./store/slices/authSlice";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import AppointmentsPage from "./pages/appointments/AppointmentsPage";
import CalendarView from "./pages/appointments/CalendarView";
import NewAppointment from "./pages/appointments/NewAppointment";
import EditAppointment from "./pages/appointments/EditAppointment";
import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import NewCustomer from "./pages/customers/NewCustomer";
import EditCustomer from "./pages/customers/EditCustomer";
import ServicesPage from "./pages/services/ServicesPage";
import NewService from "./pages/services/NewService";
import EditService from "./pages/services/EditService";
import StaffPage from "./pages/staff/StaffPage";
import NewStaff from "./pages/staff/NewStaff";
import EditStaff from "./pages/staff/EditStaff";
import ReportsPage from "./pages/reports/ReportsPage";
import GeneralSettings from "./pages/settings/GeneralSettings";
import ProfileSettings from "./pages/settings/ProfileSettings";
import BusinessSettings from "./pages/settings/BusinessSettings";
import IntegrationSettings from "./pages/settings/IntegrationSettings";
import NotFound from "./pages/NotFound";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const { t, i18n } = useTranslation();

  // Sayfa yüklendiğinde oturum durumunu kontrol et
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Mevcut dilin locale ayarlarını yap
  const currentLanguage = i18n.language || 'tr';
  const dateLocale = currentLanguage === 'tr' ? tr : undefined;

  if (loading) {
    // Yükleme ekranı
    return <div>{t('common.loading')}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocale}>
        <AuthProvider>
          <AppProvider>
            <Routes>
              {/* Kimlik doğrulama sayfaları */}
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
              <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />
              <Route path="/reset-password/:token" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/" />} />
              
              {/* Korumalı sayfalar */}
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                
                {/* Randevular */}
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="appointments/calendar" element={<CalendarView />} />
                <Route path="appointments/new" element={<NewAppointment />} />
                <Route path="appointments/:id" element={<EditAppointment />} />
                
                {/* Müşteriler */}
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/new" element={<NewCustomer />} />
                <Route path="customers/:id" element={<CustomerDetailPage />} />
                <Route path="customers/:id/edit" element={<EditCustomer />} />
                
                {/* Hizmetler */}
                <Route path="services" element={<ServicesPage />} />
                <Route path="services/new" element={<NewService />} />
                <Route path="services/:id" element={<EditService />} />
                
                {/* Personel */}
                <Route path="staff" element={<StaffPage />} />
                <Route path="staff/new" element={<NewStaff />} />
                <Route path="staff/:id" element={<EditStaff />} />
                
                {/* Raporlar */}
                <Route path="reports" element={<ReportsPage />} />
                
                {/* Ayarlar */}
                <Route path="settings" element={<GeneralSettings />} />
                <Route path="settings/profile" element={<ProfileSettings />} />
                <Route path="settings/business" element={<BusinessSettings />} />
                <Route path="settings/integrations" element={<IntegrationSettings />} />
              </Route>
              
              {/* 404 Sayfası */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;