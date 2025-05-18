import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";

import { useServices } from "../../hooks/useServices";

const ServicesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { getAllServices, deleteService, loading, error } = useServices();

  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // İlk yükleme
  useEffect(() => {
    loadServices();
  }, []);

  // Hizmetleri yükle
  const loadServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error("Hizmetler yüklenirken hata oluştu:", error);
      showNotification(t("errors.somethingWentWrong"), "error");
    }
  };

  // Arama yapıldığında
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredServices(services);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = services.filter((service) => {
        return (
          service.name.toLowerCase().includes(lowercasedFilter) ||
          (service.description &&
            service.description.toLowerCase().includes(lowercasedFilter)) ||
          (service.category &&
            service.category.toLowerCase().includes(lowercasedFilter))
        );
      });
      setFilteredServices(filtered);
    }
  }, [searchTerm, services]);

  // Hizmet silme işlemi
  const handleDeleteService = (id) => {
    setSelectedServiceId(id);
    setShowDeleteDialog(true);
  };

  // Hizmet silme onayı
  const confirmDeleteService = async () => {
    try {
      await deleteService(selectedServiceId);
      await loadServices();
      setShowDeleteDialog(false);
      showNotification(t("services.deleteSuccess"), "success");
    } catch (error) {
      console.error("Hizmet silinirken hata oluştu:", error);
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
        <Typography variant="h4">{t("services.services")}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/services/new")}
        >
          {t("services.new")}
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
          <TextField
            variant="outlined"
            size="small"
            placeholder={t("common.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredServices.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" align="center" sx={{ py: 3 }}>
                  {t("common.noData")}
                </Typography>
              </Grid>
            ) : (
              filteredServices.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderLeft: `5px solid ${service.color || "#3f51b5"}`,
                    }}
                  >
                    {service.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={service.image}
                        alt={service.name}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" component="h2" gutterBottom>
                          {service.name}
                        </Typography>
                        <Chip
                          label={t(
                            `services.${
                              service.isActive ? "active" : "inactive"
                            }`
                          )}
                          color={service.isActive ? "success" : "default"}
                          size="small"
                        />
                      </Box>

                      {service.category && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {service.category}
                        </Typography>
                      )}

                      <Typography variant="body2" sx={{ mb: 2 }} paragraph>
                        {service.description || t("services.noDescription")}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <AccessTimeIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {service.duration} {t("common.minutes")}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AttachMoneyIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {service.price} ₺
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/services/${service._id}`)}
                      >
                        {t("common.edit")}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteService(service._id)}
                      >
                        {t("common.delete")}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Paper>

      {/* Silme onay dialogu */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>{t("common.confirm")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("services.confirmDelete")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={confirmDeleteService} color="error" autoFocus>
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

export default ServicesPage;
