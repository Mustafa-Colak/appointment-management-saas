import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format, addMinutes } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  CircularProgress,
  Typography,
  Divider,
  Chip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useCustomers } from '../../../hooks/useCustomers';
import { useStaff } from '../../../hooks/useStaff';
import { useServices } from '../../../hooks/useServices';

const AppointmentForm = ({ 
  initialData, 
  onSave, 
  onCancel, 
  isReadOnly = false,
  onEdit
}) => {
  const { t, i18n } = useTranslation();
  
  // Dil için locale ayarı
  const locale = i18n.language === 'tr' ? tr : enUS;
  
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  
  const { getAllCustomers, getCustomer } = useCustomers();
  const { getAllStaff, getStaff } = useStaff();
  const { getAllServices, getService } = useServices();
  
  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Müşteri, personel ve hizmet verilerini yükle
        const [customersData, staffData, servicesData] = await Promise.all([
          getAllCustomers(),
          getAllStaff(),
          getAllServices()
        ]);
        
        setCustomers(customersData);
        setStaff(staffData);
        setServices(servicesData);
        
        // Başlangıç verileri varsa, ilgili seçili hizmeti ayarla
        if (initialData && initialData.serviceId) {
          const serviceData = await getService(initialData.serviceId._id || initialData.serviceId);
          setSelectedService(serviceData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Formik ve validasyon
  const validationSchema = Yup.object({
    customerId: Yup.string().required(t('errors.fieldRequired')),
    staffId: Yup.string().required(t('errors.fieldRequired')),
    serviceId: Yup.string().required(t('errors.fieldRequired')),
    startTime: Yup.date().required(t('errors.fieldRequired')),
    endTime: Yup.date().required(t('errors.fieldRequired'))
      .min(Yup.ref('startTime'), t('appointments.endTimeMustBeAfterStartTime')),
    status: Yup.string().required(t('errors.fieldRequired')),
    notes: Yup.string()
  });
  
  const formik = useFormik({
    initialValues: {
      customerId: initialData?.customerId?._id || initialData?.customerId || '',
      staffId: initialData?.staffId?._id || initialData?.staffId || '',
      serviceId: initialData?.serviceId?._id || initialData?.serviceId || '',
      startTime: initialData?.startTime ? new Date(initialData.startTime) : new Date(),
      endTime: initialData?.endTime ? new Date(initialData.endTime) : addMinutes(new Date(), 60),
      status: initialData?.status || 'scheduled',
      notes: initialData?.notes || ''
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
    enableReinitialize: true
  });
  
  // Seçilen hizmet değiştiğinde bitiş saatini ayarla
  useEffect(() => {
    if (selectedService && formik.values.startTime) {
      const calculatedEndTime = addMinutes(
        new Date(formik.values.startTime),
        selectedService.duration
      );
      formik.setFieldValue('endTime', calculatedEndTime);
    }
  }, [selectedService, formik.values.startTime]);
  
  // Hizmet seçildiğinde
  const handleServiceChange = async (event) => {
    const serviceId = event.target.value;
    formik.setFieldValue('serviceId', serviceId);
    
    if (serviceId) {
      try {
        const service = await getService(serviceId);
        setSelectedService(service);
      } catch (error) {
        console.error('Hizmet bilgileri alınırken hata oluştu:', error);
      }
    } else {
      setSelectedService(null);
    }
  };
  
  // Yükleniyor durumu
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Sadece görüntüleme modu
  if (isReadOnly) {
    const customerName = initialData?.customerId 
      ? `${initialData.customerId.firstName} ${initialData.customerId.lastName}`
      : '';
      
    const staffName = initialData?.staffId?.userId 
      ? `${initialData.staffId.userId.firstName} ${initialData.staffId.userId.lastName}`
      : '';
      
    const serviceName = initialData?.serviceId?.name || '';
    
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t('appointments.details')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('appointments.customer')}</Typography>
            <Typography variant="body1">{customerName}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('appointments.staff')}</Typography>
            <Typography variant="body1">{staffName}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('appointments.service')}</Typography>
            <Typography variant="body1">{serviceName}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('appointments.status')}</Typography>
            <Typography variant="body1">
              <Chip 
                label={t(`appointments.${initialData?.status.toLowerCase()}`)} 
                color={
                  initialData?.status === 'scheduled' ? 'info' :
                  initialData?.status === 'confirmed' ? 'primary' :
                  initialData?.status === 'completed' ? 'success' :
                  initialData?.status === 'cancelled' ? 'error' : 'default'
                }
                size="small"
              />
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('appointments.date')}</Typography>
            <Typography variant="body1">
              {initialData?.startTime && format(new Date(initialData.startTime), 'P', { locale })}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('appointments.time')}</Typography>
            <Typography variant="body1">
              {initialData?.startTime && format(new Date(initialData.startTime), 'p', { locale })} - 
              {initialData?.endTime && format(new Date(initialData.endTime), 'p', { locale })}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2">{t('appointments.notes')}</Typography>
            <Typography variant="body1">{initialData?.notes || '-'}</Typography>
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={onEdit}>
              {t('common.edit')}
            </Button>
            {onCancel && (
              <Button sx={{ ml: 2 }} onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }
  
  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.customerId && Boolean(formik.errors.customerId)}>
            <InputLabel id="customer-label">{t('appointments.customer')}</InputLabel>
            <Select
              labelId="customer-label"
              id="customerId"
              name="customerId"
              value={formik.values.customerId}
              onChange={formik.handleChange}
              label={t('appointments.customer')}
              disabled={isReadOnly}
            >
              {customers.map((customer) => (
                <MenuItem key={customer._id} value={customer._id}>
                  {customer.firstName} {customer.lastName}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.customerId && formik.errors.customerId && (
              <FormHelperText>{formik.errors.customerId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.staffId && Boolean(formik.errors.staffId)}>
            <InputLabel id="staff-label">{t('appointments.staff')}</InputLabel>
            <Select
              labelId="staff-label"
              id="staffId"
              name="staffId"
              value={formik.values.staffId}
              onChange={formik.handleChange}
              label={t('appointments.staff')}
              disabled={isReadOnly}
            >
              {staff.map((staffMember) => (
                <MenuItem key={staffMember._id} value={staffMember._id}>
                  {staffMember.userId.firstName} {staffMember.userId.lastName}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.staffId && formik.errors.staffId && (
              <FormHelperText>{formik.errors.staffId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}>
            <InputLabel id="service-label">{t('appointments.service')}</InputLabel>
            <Select
              labelId="service-label"
              id="serviceId"
              name="serviceId"
              value={formik.values.serviceId}
              onChange={handleServiceChange}
              label={t('appointments.service')}
              disabled={isReadOnly}
            >
              {services.map((service) => (
                <MenuItem key={service._id} value={service._id}>
                  {service.name} - {service.duration} {t('common.minutes')} - {service.price} ₺
                </MenuItem>
              ))}
            </Select>
            {formik.touched.serviceId && formik.errors.serviceId && (
              <FormHelperText>{formik.errors.serviceId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
            <InputLabel id="status-label">{t('appointments.status')}</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              label={t('appointments.status')}
              disabled={isReadOnly}
            >
              <MenuItem value="scheduled">{t('appointments.scheduled')}</MenuItem>
              <MenuItem value="confirmed">{t('appointments.confirmed')}</MenuItem>
              <MenuItem value="completed">{t('appointments.completed')}</MenuItem>
              <MenuItem value="cancelled">{t('appointments.cancelled')}</MenuItem>
              <MenuItem value="no-show">{t('appointments.noShow')}</MenuItem>
            </Select>
            {formik.touched.status && formik.errors.status && (
              <FormHelperText>{formik.errors.status}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label={t('appointments.startTime')}
            value={formik.values.startTime}
            onChange={(value) => formik.setFieldValue('startTime', value)}
            readOnly={isReadOnly}
            slotProps={{
              textField: {
                fullWidth: true,
                error: formik.touched.startTime && Boolean(formik.errors.startTime),
                helperText: formik.touched.startTime && formik.errors.startTime
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label={t('appointments.endTime')}
            value={formik.values.endTime}
            onChange={(value) => formik.setFieldValue('endTime', value)}
            readOnly={isReadOnly}
            slotProps={{
              textField: {
                fullWidth: true,
                error: formik.touched.endTime && Boolean(formik.errors.endTime),
                helperText: formik.touched.endTime && formik.errors.endTime
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="notes"
            name="notes"
            label={t('appointments.notes')}
            value={formik.values.notes}
            onChange={formik.handleChange}
            multiline
            rows={4}
            disabled={isReadOnly}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
          />
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={isReadOnly || formik.isSubmitting}
          >
            {formik.isSubmitting ? t('common.loading') : t('common.save')}
          </Button>
          {onCancel && (
            <Button 
              sx={{ ml: 2 }} 
              onClick={onCancel}
              disabled={formik.isSubmitting}
            >
              {t('common.cancel')}
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentForm;