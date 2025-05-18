import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main application pages
import Dashboard from './pages/dashboard/Dashboard';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import CalendarView from './pages/appointments/CalendarView';
import CustomersPage from './pages/customers/CustomersPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';
import ServicesPage from './pages/services/ServicesPage';
import StaffPage from './pages/staff/StaffPage';
import ReportsPage from './pages/reports/ReportsPage';

// Settings pages
import GeneralSettings from './pages/settings/GeneralSettings';
import ProfileSettings from './pages/settings/ProfileSettings';
import BusinessSettings from './pages/settings/BusinessSettings';
import LanguageSettings from './pages/settings/LanguageSettings';

const routes = [
  // Public routes
  {
    path: '/login',
    element: <Login />,
    public: true
  },
  {
    path: '/register',
    element: <Register />,
    public: true
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    public: true
  },
  
  // Protected routes (require authentication)
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      // Appointments
      {
        path: '/appointments',
        element: <AppointmentsPage />
      },
      {
        path: '/appointments/calendar',
        element: <CalendarView />
      },
      // Customers
      {
        path: '/customers',
        element: <CustomersPage />
      },
      {
        path: '/customers/:id',
        element: <CustomerDetailPage />
      },
      // Services
      {
        path: '/services',
        element: <ServicesPage />
      },
      // Staff
      {
        path: '/staff',
        element: <StaffPage />
      },
      // Reports
      {
        path: '/reports',
        element: <ReportsPage />
      },
      // Settings
      {
        path: '/settings',
        element: <GeneralSettings />
      },
      {
        path: '/settings/profile',
        element: <ProfileSettings />
      },
      {
        path: '/settings/business',
        element: <BusinessSettings />
      },
      {
        path: '/settings/language',
        element: <LanguageSettings />
      },
      // Fallback route
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
];

export default routes;