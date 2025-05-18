import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MoreHoriz as MoreHorizIcon
} from '@mui/icons-material';

// Randevu durumu renklerini tanımla
const statusColors = {
  scheduled: 'info',
  confirmed: 'primary',
  completed: 'success',
  cancelled: 'error',
  'no-show': 'warning'
};

const AppointmentList = ({ appointments, compact = false, onEdit, onDelete, onComplete, onCancel }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Dil için locale ayarı
  const locale = i18n.language === 'tr' ? tr : enUS;
  
  // Randevu düzenleme sayfasına git
  const handleEdit = (id) => {
    if (onEdit) {
      onEdit(id);
    } else {
      navigate(`/appointments/${id}`);
    }
  };
  
  // Durum metinleri ve çipler
  const getStatusChip = (status) => {
    return (
      <Chip 
        label={t(`appointments.${status.toLowerCase()}`)} 
        color={statusColors[status] || 'default'} 
        size={compact ? 'small' : 'medium'} 
        variant="contained"
      />
    );
  };
  
  // Veri yoksa mesaj göster
  if (!appointments || appointments.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body1">{t('common.noData')}</Typography>
      </Box>
    );
  }
  
  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table size={compact ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell>{t('appointments.customer')}</TableCell>
            <TableCell>{t('appointments.service')}</TableCell>
            <TableCell>{t('appointments.staff')}</TableCell>
            <TableCell>{t('appointments.date')}</TableCell>
            <TableCell>{t('appointments.time')}</TableCell>
            <TableCell>{t('appointments.status')}</TableCell>
            <TableCell align="right">{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id} hover>
              <TableCell>
                {appointment.customerId 
                  ? `${appointment.customerId.firstName} ${appointment.customerId.lastName}`
                  : '—'}
              </TableCell>
              <TableCell>
                {appointment.serviceId 
                  ? appointment.serviceId.name 
                  : '—'}
              </TableCell>
              <TableCell>
                {appointment.staffId && appointment.staffId.userId
                  ? `${appointment.staffId.userId.firstName} ${appointment.staffId.userId.lastName}`
                  : '—'}
              </TableCell>
              <TableCell>
                {format(new Date(appointment.startTime), 'P', { locale })}
              </TableCell>
              <TableCell>
                {format(new Date(appointment.startTime), 'p', { locale })}
              </TableCell>
              <TableCell>
                {getStatusChip(appointment.status)}
              </TableCell>
              <TableCell align="right">
                {/* İşlem butonları */}
                <Box>
                  <Tooltip title={t('common.edit')}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(appointment._id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  {!compact && appointment.status !== 'completed' && (
                    <Tooltip title={t('appointments.completed')}>
                      <IconButton
                        size="small"
                        onClick={() => onComplete && onComplete(appointment._id)}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {!compact && appointment.status !== 'cancelled' && (
                    <Tooltip title={t('appointments.cancelled')}>
                      <IconButton
                        size="small"
                        onClick={() => onCancel && onCancel(appointment._id)}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {!compact && (
                    <Tooltip title={t('common.delete')}>
                      <IconButton
                        size="small"
                        onClick={() => onDelete && onDelete(appointment._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {compact && (
                    <Tooltip title={t('common.details')}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/appointments/${appointment._id}`)}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppointmentList;