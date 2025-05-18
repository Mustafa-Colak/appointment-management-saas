import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  format,
  startOfToday,
  endOfToday,
  addDays,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { tr, enUS } from "date-fns/locale";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

import AppointmentList from "../../components/modules/appointments/AppointmentList";
import { useAppointments } from "../../hooks/useAppointments";
import { useStaff } from "../../hooks/useStaff";
import { useCustomers } from "../../hooks/useCustomers";
import { useServices } from "../../hooks/useServices";

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Dil için locale ayarı
  const locale = i18n.language === "tr" ? tr : enUS;

  // Hook'lar
  const {
    getAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();

  const { getAllStaff } = useStaff();
  const { getAllCustomers } = useCustomers();
  const { getAllServices } = useServices();

  // Durum değişkenleri
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState("today");
  const [startDate, setStartDate] = useState(startOfToday());
  const [endDate, setEndDate] = useState(endOfToday());
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // İlk yükleme
  useEffect(() => {
    loadData();
  }, []);

  // Veri yükleme fonksiyonu
  const loadData = async () => {
    try {
      // Personel, müşteri ve hizmet verilerini yükle
      const [staffData, customersData, servicesData] = await Promise.all([
        getAllStaff(),
        getAllCustomers(),
        getAllServices(),
      ]);

      setStaff(staffData);
      setCustomers(customersData);
      setServices(servicesData);

      // Randevuları yükle
      await loadAppointments();
    } catch (error) {
      console.error("Veriler yüklenirken hata oluştu:", error);
      showNotification(t("errors.somethingWentWrong"), "error");
    }
  };

  // Randevuları yükle
  const loadAppointments = async () => {
    try {
      const filters = {
        startDate,
        endDate,
      };

      if (selectedStaff) filters.staffId = selectedStaff;
      if (selectedCustomer) filters.customerId = selectedCustomer;
      if (selectedService) filters.serviceId = selectedService;
      if (selectedStatus) filters.status = selectedStatus;

      const data = await getAppointments(filters);
      setAppointments(data);
    } catch (error) {
      console.error("Randevular yüklenirken hata oluştu:", error);
      showNotification(t("errors.somethingWentWrong"), "error");
    }
  };

  // Tarih aralığı değiştiğinde filtrele
  useEffect(() => {
    loadAppointments();
  }, [
    startDate,
    endDate,
    selectedStaff,
    selectedCustomer,
    selectedService,
    selectedStatus,
  ]);

  // Önceden tanımlanmış tarih aralığı seçildiğinde
  const handleDateRangeChange = (range) => {
    setDateRange(range);

    const today = new Date();

    switch (range) {
      case "today":
        setStartDate(startOfToday());
        setEndDate(endOfToday());
        break;
      case "tomorrow":
        const tomorrow = addDays(today, 1);
        setStartDate(new Date(tomorrow.setHours(0, 0, 0, 0)));
        setEndDate(new Date(tomorrow.setHours(23, 59, 59, 999)));
        break;
      case "thisWeek":
        setStartDate(startOfWeek(today, { locale }));
        setEndDate(endOfWeek(today, { locale }));
        break;
      case "custom":
        // Özel aralık seçildiğinde tarihler değişmez
        break;
      default:
        setStartDate(startOfToday());
        setEndDate(endOfToday());
    }
  };

  // Randevu durumunu güncelle
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      await loadAppointments();

      showNotification(
        status === "completed"
          ? t("appointments.completeSuccess")
          : t("appointments.cancelSuccess"),
        "success"
      );
    } catch (error) {
      console.error("Randevu durumu güncellenirken hata oluştu:", error);
      showNotification(t("errors.somethingWentWrong"), "error");
    }
  };

  // Randevu tamamlandı
  const handleCompleteAppointment = (id) => {
    handleUpdateStatus(id, "completed");
  };

  // Randevu iptal edildi
  const handleCancelAppointment = (id) => {
    handleUpdateStatus(id, "cancelled");
  };

  // Randevu sil
  const handleDeleteAppointment = (id) => {
    setSelectedAppointmentId(id);
    setShowDeleteDialog(true);
  };

  // Randevu silmeyi onayla
  const confirmDeleteAppointment = async () => {
    try {
      await deleteAppointment(selectedAppointmentId);
      await loadAppointments();
      setShowDeleteDialog(false);
      showNotification(t("appointments.deleteSuccess"), "success");
    } catch (error) {
      console.error("Randevu silinirken hata oluştu:", error);
      showNotification(t("errors.somethingWentWrong"), "error");
    }
  };

  // Bildirim göster
  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Bildirim kapat
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Filtreleri sıfırla
  const resetFilters = () => {
    setSelectedStaff("");
    setSelectedCustomer("");
    setSelectedService("");
    setSelectedStatus("");
    setDateRange("today");
    setStartDate(startOfToday());
    setEndDate(endOfToday());
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{t("appointments.appointments")}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/appointments/new")}
        >
          {t("appointments.new")}
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControl sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel id="date-range-label">{t("common.date")}</InputLabel>
              <Select
                labelId="date-range-label"
                value={dateRange}
                label={t("common.date")}
                onChange={(e) => handleDateRangeChange(e.target.value)}
              >
                <MenuItem value="today">{t("appointments.today")}</MenuItem>
                <MenuItem value="tomorrow">
                  {t("appointments.tomorrow")}
                </MenuItem>
                <MenuItem value="thisWeek">
                  {t("appointments.thisWeek")}
                </MenuItem>
                <MenuItem value="custom">{t("reports.customRange")}</MenuItem>
              </Select>
            </FormControl>

            {dateRange === "custom" && (
              <>
                <DatePicker
                  label={t("reports.startDate")}
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  slotProps={{ textField: { size: "small", sx: { mr: 2 } } }}
                />
                <DatePicker
                  label={t("reports.endDate")}
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  slotProps={{ textField: { size: "small" } }}
                />
              </>
            )}

            <Tooltip title={t("common.filter")}>
              <IconButton
                color={showFilters ? "primary" : "default"}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ ml: 2 }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("common.reset")}>
              <IconButton onClick={resetFilters} sx={{ ml: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {showFilters && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="staff-filter-label">
                  {t("appointments.staff")}
                </InputLabel>
                <Select
                  labelId="staff-filter-label"
                  value={selectedStaff}
                  label={t("appointments.staff")}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>
                  {staff.map((staffMember) => (
                    <MenuItem key={staffMember._id} value={staffMember._id}>
                      {staffMember.userId.firstName}{" "}
                      {staffMember.userId.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="customer-filter-label">
                  {t("appointments.customer")}
                </InputLabel>
                <Select
                  labelId="customer-filter-label"
                  value={selectedCustomer}
                  label={t("appointments.customer")}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>
                  {customers.map((customer) => (
                    <MenuItem key={customer._id} value={customer._id}>
                      {customer.firstName} {customer.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="service-filter-label">
                  {t("appointments.service")}
                </InputLabel>
                <Select
                  labelId="service-filter-label"
                  value={selectedService}
                  label={t("appointments.service")}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>
                  {services.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">
                  {t("appointments.status")}
                </InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={selectedStatus}
                  label={t("appointments.status")}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>
                  <MenuItem value="scheduled">
                    {t("appointments.scheduled")}
                  </MenuItem>
                  <MenuItem value="confirmed">
                    {t("appointments.confirmed")}
                  </MenuItem>
                  <MenuItem value="completed">
                    {t("appointments.completed")}
                  </MenuItem>
                  <MenuItem value="cancelled">
                    {t("appointments.cancelled")}
                  </MenuItem>
                  <MenuItem value="no-show">
                    {t("appointments.noShow")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {appointmentsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : appointmentsError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {appointmentsError}
          </Alert>
        ) : (
          <AppointmentList
            appointments={appointments}
            onComplete={handleCompleteAppointment}
            onCancel={handleCancelAppointment}
            onDelete={handleDeleteAppointment}
          />
        )}
      </Paper>

      {/* Silme onay dialogu */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>{t("common.confirm")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("appointments.confirmDelete")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={confirmDeleteAppointment} color="error" autoFocus>
            {t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bildirim snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentsPage;
