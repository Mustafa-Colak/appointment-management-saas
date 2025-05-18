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
  FormControlLabel,
  Switch,
  CircularProgress,
  Typography,
  Divider,
  Paper,
  Chip,
  Slider,
  InputAdornment
} from '@mui/material';
import { ColorPicker } from 'material-ui-color';

const ServiceForm = ({ 
  initialData, 
  onSave, 
  onCancel, 
  loading = false,
  isReadOnly = false,
  onEdit,
  categories = []
}) => {
  const { t } = useTranslation();
  
  // Formik ve validasyon
  const validationSchema = Yup.object({
    name: Yup.string().required(t('errors.fieldRequired')),
    description: Yup.string(),
    duration: Yup.number()
      .required(t('errors.fieldRequired'))
      .min(5, t('services.durationMinimum'))
      .max(480, t('services.durationMaximum')),
    price: Yup.number()
      .required(t('errors.fieldRequired'))
      .min(0, t('services.priceMinimum')),
    category: Yup.string(),
    isActive: Yup.boolean(),
    color: Yup.string()
  });
  
  const formik = useFormik({
    initialValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      duration: initialData?.duration || 60,
      price: initialData?.price || 0,
      category: initialData?.category || '',
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      color: initialData?.color || '#3f51b5'
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
    enableReinitialize: true
  });
  
  // Kategori listesi
  const defaultCategories = [
    'hair', 'skin', 'nails', 'massage', 'dental', 'veterinary', 'consultation', 'other'
  ];
  
  const allCategories = [...new Set([...defaultCategories, ...categories])];
  
  // Renk değişikliği
  const handleColorChange = (color) => {
    formik.setFieldValue('color', color.css.backgroundColor);
  };
  
  // Sadece görüntüleme modu
  if (isReadOnly) {
    return (
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t('services.details')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('services.name')}</Typography>
            <Typography variant="body1">{initialData?.name}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('common.status')}</Typography>
            <Typography variant="body1">
              <Chip 
                label={t(`services.${initialData?.isActive ? 'active' : 'inactive'}`)}
                color={initialData?.isActive ? 'success' : 'default'}
                size="small"
              />
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2">{t('services.description')}</Typography>
            <Typography variant="body1">{initialData?.description || '-'}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('services.duration')}</Typography>
            <Typography variant="body1">{initialData?.duration} {t('common.minutes')}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('services.price')}</Typography>
            <Typography variant="body1">{initialData?.price} ₺</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('services.category')}</Typography>
            <Typography variant="body1">{initialData?.category || '-'}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">{t('services.color')}</Typography>
            <Box 
              sx={{ 
                width: 30, 
                height: 30, 
                borderRadius: '50%', 
                bgcolor: initialData?.color || '#3f51b5',
                border: '1px solid #ddd'
              }} 
            />
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label={t('services.name')}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={isReadOnly || loading}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label={t('services.description')}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            disabled={isReadOnly || loading}
            multiline
            rows={4}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="duration"
            name="duration"
            label={t('services.duration')}
            value={formik.values.duration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.duration && Boolean(formik.errors.duration)}
            helperText={formik.touched.duration && formik.errors.duration}
            disabled={isReadOnly || loading}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">{t('common.minutes')}</InputAdornment>,
            }}
            required
          />
          <Slider
            value={typeof formik.values.duration === 'number' ? formik.values.duration : 60}
            onChange={(event, newValue) => {
              formik.setFieldValue('duration', newValue);
            }}
            aria-labelledby="duration-slider"
            valueLabelDisplay="auto"
            step={5}
            marks
            min={5}
            max={240}
            disabled={isReadOnly || loading}
            sx={{ mt: 2 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="price"
            name="price"
            label={t('services.price')}
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            disabled={isReadOnly || loading}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">₺</InputAdornment>,
            }}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl 
            fullWidth
            error={formik.touched.category && Boolean(formik.errors.category)}
          >
            <InputLabel id="category-label">{t('services.category')}</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label={t('services.category')}
              disabled={isReadOnly || loading}
            >
              <MenuItem value="">{t('common.none')}</MenuItem>
              {allCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {t(`services.categories.${category}`, category)}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.category && formik.errors.category && (
              <FormHelperText>{formik.errors.category}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" gutterBottom>
            {t('services.color')}
          </Typography>
          <ColorPicker
            value={formik.values.color}
            onChange={handleColorChange}
            disabled={isReadOnly || loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isActive}
                onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                name="isActive"
                color="primary"
                disabled={isReadOnly || loading}
              />
            }
            label={t('services.active')}
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

export default ServiceForm;