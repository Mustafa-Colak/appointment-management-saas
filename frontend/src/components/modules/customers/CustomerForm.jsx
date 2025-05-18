import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
  CircularProgress,
  Typography,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CustomerForm = ({ 
  initialData, 
  onSave, 
  onCancel, 
  loading = false,
  isReadOnly = false,
  onEdit
}) => {
  const { t } = useTranslation();
  
  // Formik ve validasyon
  const validationSchema = Yup.object({
    firstName: Yup.string().required(t('errors.fieldRequired')),
    lastName: Yup.string().required(t('errors.fieldRequired')),
    email: Yup.string().email(t('errors.invalidEmail')),
    phone: Yup.string().required(t('errors.fieldRequired')),
    gender: Yup.string(),
    birthDate: Yup.date().nullable(),
    address: Yup.object().shape({
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zip: Yup.string(),
      country: Yup.string()
    }),
    membershipStatus: Yup.string().required(t('errors.fieldRequired')),
    notes: Yup.string()
  });
  
  const formik = useFormik({
    initialValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      gender: initialData?.gender || 'unspecified',
      birthDate: initialData?.birthDate ? new Date(initialData.birthDate) : null,
      address: {
        street: initialData?.address?.street || '',
        city: initialData?.address?.city || '',
        state: initialData?.address?.state || '',
        zip: initialData?.address?.zip || '',
        country: initialData?.address?.country || ''
      },
      membershipStatus: initialData?.membershipStatus || 'active',
      notes: initialData?.notes || ''
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
    enableReinitialize: true
  });
  
  // Sadece görüntüleme modu
  if (isReadOnly) {
    return (
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t('customers.details')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('customers.firstName')}</Typography>
            <Typography variant="body1">{initialData?.firstName}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('customers.lastName')}</Typography>
            <Typography variant="body1">{initialData?.lastName}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('customers.email')}</Typography>
            <Typography variant="body1">{initialData?.email || '-'}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('customers.phone')}</Typography>
            <Typography variant="body1">{initialData?.phone}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('customers.gender')}</Typography>
            <Typography variant="body1">
              {initialData?.gender ? t(`customers.${initialData.gender}`) : '-'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('customers.birthDate')}</Typography>
            <Typography variant="body1">
              {initialData?.birthDate 
                ? new Date(initialData.birthDate).toLocaleDateString() 
                : '-'}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2">{t('customers.address')}</Typography>
            <Typography variant="body1">
              {initialData?.address?.street ? initialData.address.street : '-'}<br />
              {initialData?.address?.city && initialData.address.zip ? 
                `${initialData.address.zip} ${initialData.address.city}` : 
                (initialData?.address?.city || '')}
              {initialData?.address?.state ? `, ${initialData.address.state}` : ''}
              {initialData?.address?.country ? `, ${initialData.address.country}` : ''}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('common.status')}</Typography>
            <Typography variant="body1">
              <Chip 
                label={t(`customers.${initialData?.membershipStatus}`)}
                color={initialData?.membershipStatus === 'active' ? 'success' : 'default'}
                size="small"
              />
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2">{t('customers.notes')}</Typography>
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
      </Paper>
    );
  }
  
  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label={t('customers.firstName')}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            disabled={isReadOnly || loading}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label={t('customers.lastName')}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            disabled={isReadOnly || loading}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label={t('customers.email')}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={isReadOnly || loading}
            type="email"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label={t('customers.phone')}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            disabled={isReadOnly || loading}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl 
            fullWidth
            error={formik.touched.gender && Boolean(formik.errors.gender)}
          >
            <InputLabel id="gender-label">{t('customers.gender')}</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label={t('customers.gender')}
              disabled={isReadOnly || loading}
            >
              <MenuItem value="male">{t('customers.male')}</MenuItem>
              <MenuItem value="female">{t('customers.female')}</MenuItem>
              <MenuItem value="other">{t('customers.other')}</MenuItem>
              <MenuItem value="unspecified">{t('customers.unspecified')}</MenuItem>
            </Select>
            {formik.touched.gender && formik.errors.gender && (
              <FormHelperText>{formik.errors.gender}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <DatePicker
            label={t('customers.birthDate')}
            value={formik.values.birthDate}
            onChange={(value) => formik.setFieldValue('birthDate', value)}
            slotProps={{
              textField: {
                fullWidth: true,
                error: formik.touched.birthDate && Boolean(formik.errors.birthDate),
                helperText: formik.touched.birthDate && formik.errors.birthDate,
                disabled: isReadOnly || loading
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('customers.address')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="address.street"
            name="address.street"
            label={t('common.street')}
            value={formik.values.address.street}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.street && Boolean(formik.errors.address?.street)}
            helperText={formik.touched.address?.street && formik.errors.address?.street}
            disabled={isReadOnly || loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="address.city"
            name="address.city"
            label={t('customers.city')}
            value={formik.values.address.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
            helperText={formik.touched.address?.city && formik.errors.address?.city}
            disabled={isReadOnly || loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="address.state"
            name="address.state"
            label={t('common.state')}
            value={formik.values.address.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
            helperText={formik.touched.address?.state && formik.errors.address?.state}
            disabled={isReadOnly || loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="address.zip"
            name="address.zip"
            label={t('common.zipCode')}
            value={formik.values.address.zip}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.zip && Boolean(formik.errors.address?.zip)}
            helperText={formik.touched.address?.zip && formik.errors.address?.zip}
            disabled={isReadOnly || loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="address.country"
            name="address.country"
            label={t('common.country')}
            value={formik.values.address.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address?.country && Boolean(formik.errors.address?.country)}
            helperText={formik.touched.address?.country && formik.errors.address?.country}
            disabled={isReadOnly || loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl 
            fullWidth
            error={formik.touched.membershipStatus && Boolean(formik.errors.membershipStatus)}
          >
            <InputLabel id="membershipStatus-label">{t('common.status')}</InputLabel>
            <Select
              labelId="membershipStatus-label"
              id="membershipStatus"
              name="membershipStatus"
              value={formik.values.membershipStatus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label={t('common.status')}
              disabled={isReadOnly || loading}
            >
              <MenuItem value="active">{t('customers.active')}</MenuItem>
              <MenuItem value="inactive">{t('customers.inactive')}</MenuItem>
              <MenuItem value="pending">{t('common.pending')}</MenuItem>
            </Select>
            {formik.touched.membershipStatus && formik.errors.membershipStatus && (
              <FormHelperText>{formik.errors.membershipStatus}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="notes"
            name="notes"
            label={t('customers.notes')}
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
            disabled={isReadOnly || loading}
            multiline
            rows={4}
          />
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={isReadOnly || loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('common.save')
            )}
          </Button>
          {onCancel && (
            <Button 
              sx={{ ml: 2 }} 
              onClick={onCancel}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerForm;