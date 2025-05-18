import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { DataGrid, trTR, enUS } from '@mui/x-data-grid';

import { useCustomers } from '../../hooks/useCustomers';

const CustomersPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Dil için locale ayarı
  const locale = i18n.language === 'tr' ? trTR : enUS;
  
  const { 
    getAllCustomers, 
    deleteCustomer, 
    loading, 
    error 
  } = useCustomers();
  
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Menü durumu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuCustomerId, setMenuCustomerId] = useState(null);
  
  // İlk yükleme
  useEffect(() => {
    loadCustomers();
  }, []);
  
  // Müşterileri yükle
  const loadCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Müşteriler yüklenirken hata oluştu:', error);
      showNotification(t('errors.somethingWentWrong'), 'error');
    }
  };
  
  // Arama yapıldığında
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = customers.filter((customer) => {
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        return (
          fullName.includes(lowercasedFilter) ||
          (customer.email && customer.email.toLowerCase().includes(lowercasedFilter)) ||
          (customer.phone && customer.phone.toLowerCase().includes(lowercasedFilter))
        );
      });
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);
  
  // Menüyü aç
  const handleMenuOpen = (event, customerId) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuCustomerId(customerId);
  };
  
  // Menüyü kapat
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuCustomerId(null);
  };
  
  // Müşteri silme işlemi
  const handleDeleteCustomer = (id) => {
    setSelectedCustomerId(id);
    setShowDeleteDialog(true);
    handleMenuClose();
  };
  
  // Müşteri silme onayı
  const confirmDeleteCustomer = async () => {
    try {
      await deleteCustomer(selectedCustomerId);
      await loadCustomers();
      setShowDeleteDialog(false);
      showNotification(t('customers.deleteSuccess'), 'success');
    } catch (error) {
      console.error('Müşteri silinirken hata oluştu:', error);
      showNotification(t('errors.somethingWentWrong'), 'error');
    }
  };
  
  // Bildirim göster
  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };
  
  // Bildirim kapat
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // DataGrid sütunları
  const columns = [
    {
      field: 'fullName',
      headerName: t('customers.fullName'),
      flex: 2,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`
    },
    {
      field: 'email',
      headerName: t('customers.email'),
      flex: 2,
      minWidth: 150
    },
    {
      field: 'phone',
      headerName: t('customers.phone'),
      flex: 1.5,
      minWidth: 120
    },
    {
      field: 'membershipStatus',
      headerName: t('common.status'),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={t(`customers.${params.value}`)}
          color={params.value === 'active' ? 'success' : params.value === 'inactive' ? 'default' : 'warning'}
          size="small"
        />
      )
    },
    {
      field: 'createdAt',
      headerName: t('common.createdAt'),
      flex: 1.5,
      minWidth: 130,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString(
          i18n.language === 'tr' ? 'tr-TR' : 'en-US'
        );
      }
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title={t('common.edit')}>
            <IconButton 
              size="small" 
              onClick={() => navigate(`/customers/${params.id}/edit`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.more')}>
            <IconButton
              size="small"
              onClick={(event) => handleMenuOpen(event, params.id)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{t('customers.customers')}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/customers/new')}
        >
          {t('customers.new')}
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder={t('common.search')}
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
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Box>
            <Tooltip title={t('customers.importCustomers')}>
              <IconButton sx={{ mr: 1 }}>
                <ImportIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('customers.exportCustomers')}>
              <IconButton>
                <ExportIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <DataGrid
            rows={filteredCustomers}
            columns={columns}
            autoHeight
            pagination
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              },
              sorting: {
                sortModel: [{ field: 'createdAt', sort: 'desc' }]
              }
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            localeText={locale.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100]
              }
            }}
          />
        )}
      </Paper>
      
      {/* Müşteri aksiyonları menüsü */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          navigate(`/customers/${menuCustomerId}`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('customers.details')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/customers/${menuCustomerId}/edit`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.edit')}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          // E-posta gönderme işlemi
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('customers.sendEmail')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          // SMS gönderme işlemi
          handleMenuClose();
        }}>
          <ListItemIcon>
            <SmsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('customers.sendSms')}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteCustomer(menuCustomerId)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.delete')}</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Silme onay dialogu */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('customers.confirmDelete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={confirmDeleteCustomer} 
            color="error" 
            autoFocus
          >
            {t('common.delete')}
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
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomersPage;