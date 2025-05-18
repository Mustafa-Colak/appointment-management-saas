# create-frontend-files.ps1
# Frontend dosyalarını oluşturur

param (
    [string]$rootFolder
)

# Frontend dosyaları
$frontendFiles = @(
    # React component dosyaları
    "frontend\src\App.jsx",
    "frontend\src\index.js",
    "frontend\src\routes.js",
    
    # Temel konfigürasyon dosyaları
    "frontend\package.json",
    "frontend\.env.example",
    "frontend\vite.config.js",
    
    # Public dosyaları
    "frontend\public\index.html",
    "frontend\public\favicon.ico",
    
    # Style dosyaları
    "frontend\src\styles\globals.css",
    "frontend\src\styles\variables.css",
    "frontend\src\styles\themes.css",
    
    # Config dosyaları
    "frontend\src\config\api.js",
    "frontend\src\config\theme.js",
    
    # Context dosyaları
    "frontend\src\context\AuthContext.js",
    "frontend\src\context\AppContext.js",
    "frontend\src\context\NotificationContext.js",
    
    # Hook dosyaları
    "frontend\src\hooks\useAuth.js",
    "frontend\src\hooks\useFetch.js",
    "frontend\src\hooks\useForm.js",
    "frontend\src\hooks\useAppointments.js",
    "frontend\src\hooks\useCustomers.js",
    "frontend\src\hooks\useServices.js",
    "frontend\src\hooks\useStaff.js",
    "frontend\src\hooks\useReports.js",
    
    # Services dosyaları
    "frontend\src\services\api.js",
    "frontend\src\services\auth.js",
    "frontend\src\services\appointments.js",
    "frontend\src\services\customers.js",
    "frontend\src\services\services.js",
    "frontend\src\services\staff.js",
    "frontend\src\services\reports.js",
    
    # Utils dosyaları
    "frontend\src\utils\date.js",
    "frontend\src\utils\format.js",
    "frontend\src\utils\validation.js",
    "frontend\src\utils\helpers.js",
    
    # Store dosyaları
    "frontend\src\store\index.js",
    "frontend\src\store\slices\authSlice.js",
    "frontend\src\store\slices\appointmentSlice.js",
    "frontend\src\store\slices\customerSlice.js",
    "frontend\src\store\slices\serviceSlice.js",
    
    # Common bileşenler
    "frontend\src\components\common\Button.jsx",
    "frontend\src\components\common\Input.jsx",
    "frontend\src\components\common\Modal.jsx",
    "frontend\src\components\common\Card.jsx",
    "frontend\src\components\common\FormElements.jsx",
    "frontend\src\components\common\ProtectedRoute.jsx",
    
    # Layout bileşenleri
    "frontend\src\components\layout\Header.jsx",
    "frontend\src\components\layout\Sidebar.jsx",
    "frontend\src\components\layout\Footer.jsx",
    "frontend\src\components\layout\Layout.jsx",
    
    # Modül bileşenleri - Randevular
    "frontend\src\components\modules\appointments\AppointmentForm.jsx",
    "frontend\src\components\modules\appointments\AppointmentList.jsx",
    "frontend\src\components\modules\appointments\AppointmentCalendar.jsx",
    "frontend\src\components\modules\appointments\AppointmentDetails.jsx",
    
    # Modül bileşenleri - Müşteriler
    "frontend\src\components\modules\customers\CustomerForm.jsx",
    "frontend\src\components\modules\customers\CustomerList.jsx",
    "frontend\src\components\modules\customers\CustomerDetails.jsx",
    "frontend\src\components\modules\customers\CustomerHistory.jsx",
    
    # Modül bileşenleri - Hizmetler
    "frontend\src\components\modules\services\ServiceForm.jsx",
    "frontend\src\components\modules\services\ServiceList.jsx",
    "frontend\src\components\modules\services\ServiceDetails.jsx",
    
    # Modül bileşenleri - Personel
    "frontend\src\components\modules\staff\StaffForm.jsx",
    "frontend\src\components\modules\staff\StaffList.jsx",
    "frontend\src\components\modules\staff\StaffSchedule.jsx",
    
    # Modül bileşenleri - Ödemeler
    "frontend\src\components\modules\payments\PaymentForm.jsx",
    "frontend\src\components\modules\payments\PaymentHistory.jsx",
    
    # Sayfa bileşenleri - Auth
    "frontend\src\pages\auth\Login.jsx",
    "frontend\src\pages\auth\Register.jsx",
    "frontend\src\pages\auth\ForgotPassword.jsx",
    
    # Sayfa bileşenleri - Dashboard
    "frontend\src\pages\dashboard\Dashboard.jsx",
    
    # Sayfa bileşenleri - Randevular
    "frontend\src\pages\appointments\AppointmentsPage.jsx",
    "frontend\src\pages\appointments\CalendarView.jsx",
    
    # Sayfa bileşenleri - Müşteriler
    "frontend\src\pages\customers\CustomersPage.jsx",
    "frontend\src\pages\customers\CustomerDetailPage.jsx",
    
    # Sayfa bileşenleri - Hizmetler
    "frontend\src\pages\services\ServicesPage.jsx",
    
    # Sayfa bileşenleri - Personel
    "frontend\src\pages\staff\StaffPage.jsx",
    
    # Sayfa bileşenleri - Raporlar
    "frontend\src\pages\reports\ReportsPage.jsx",
    
    # Sayfa bileşenleri - Ayarlar
    "frontend\src\pages\settings\GeneralSettings.jsx",
    "frontend\src\pages\settings\ProfileSettings.jsx",
    "frontend\src\pages\settings\BusinessSettings.jsx",
    "frontend\src\pages\settings\IntegrationSettings.jsx"
)

# Tüm frontend dosyalarını oluştur
foreach ($file in $frontendFiles) {
    $filePath = "$rootFolder\$file"
    New-Item -Path $filePath -ItemType File -Force | Out-Null
    # Her bir dosya için bir varsayılan içerik ekle
    if ($file -match "\.js$|\.jsx$|\.ts$|\.tsx$") {
        Set-Content -Path $filePath -Value "// $file dosyası"
    } elseif ($file -match "\.html$") {
        Set-Content -Path $filePath -Value "<!-- $file dosyası -->"
    } elseif ($file -match "\.css$") {
        Set-Content -Path $filePath -Value "/* $file dosyası */"
    } elseif ($file -match "\.json$") {
        Set-Content -Path $filePath -Value '{}'
    }
    Write-Host "Dosya oluşturuldu: $filePath" -ForegroundColor Cyan
}

# Frontend için package.json dosyasını güncelle
Set-Content -Path "$rootFolder\frontend\package.json" -Value '{
  "name": "appointment-management-saas-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.11.16",
    "@mui/material": "^5.13.0",
    "@mui/x-data-grid": "^6.4.0",
    "@mui/x-date-pickers": "^6.4.0",
    "@reduxjs/toolkit": "^1.9.5",
    "axios": "^1.4.0",
    "date-fns": "^2.30.0",
    "formik": "^2.2.9",
    "react": "^18.2.0",
    "react-big-calendar": "^1.6.9",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.11.1",
    "recharts": "^2.6.2",
    "yup": "^1.1.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.5"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}'

# Önemli frontend dosyalarına içerik ekle
Set-Content -Path "$rootFolder\frontend\src\services\api.js" -Value '// API servisi
import axios from "axios";

// API URL"sini ortam değişkenlerinden al
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Auth token ekleme
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized hatası - token geçersiz veya süresi dolmuş
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;'

Set-Content -Path "$rootFolder\frontend\src\hooks\useAppointments.js" -Value '// useAppointments hook
import { useState } from "react";
import appointmentService from "../services/appointments";

export const useAppointments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Randevuları getir
  const getAppointments = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAppointments(filters);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Belirli bir randevuyu getir
  const getAppointment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAppointment(id);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Yeni randevu oluştur
  const createAppointment = async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.createAppointment(appointmentData);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Randevu güncelle
  const updateAppointment = async (id, appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.updateAppointment(id, appointmentData);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Randevu sil
  const deleteAppointment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.deleteAppointment(id);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  return {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    loading,
    error
  };
};'

Set-Content -Path "$rootFolder\frontend\src\components\modules\appointments\AppointmentCalendar.jsx" -Value '// AppointmentCalendar component
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppointments } from "../../../hooks/useAppointments";
import AppointmentForm from "./AppointmentForm";
import Modal from "../../common/Modal";

const localizer = momentLocalizer(moment);

const AppointmentCalendar = ({ staffId, customerId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // "view", "create", "edit"
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const { getAppointments, createAppointment, updateAppointment, deleteAppointment } = useAppointments();
  
  // Randevuları yükle
  useEffect(() => {
    loadAppointments();
  }, [staffId, customerId]);
  
  const loadAppointments = async () => {
    try {
      const filters = {};
      if (staffId) filters.staffId = staffId;
      if (customerId) filters.customerId = customerId;
      
      const result = await getAppointments(filters);
      
      // Calendar formatına dönüştür
      const formattedAppointments = result.map(appointment => ({
        id: appointment._id,
        title: appointment.service.name,
        start: new Date(appointment.startTime),
        end: new Date(appointment.endTime),
        resource: appointment
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Randevular yüklenirken hata oluştu:", error);
    }
  };
  
  // Diğer fonksiyonlar...
  
  return (
    <div className="appointment-calendar">
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={(event) => {
          setSelectedAppointment(event.resource);
          setModalType("view");
          setShowModal(true);
        }}
        onSelectSlot={(slotInfo) => {
          setSelectedSlot({
            startTime: slotInfo.start,
            endTime: slotInfo.end
          });
          setModalType("create");
          setShowModal(true);
        }}
        selectable
        step={15}
        timeslots={4}
        defaultView="week"
        views={["day", "week", "month"]}
      />
      
      {/* Modal */}
    </div>
  );
};

export default AppointmentCalendar;'