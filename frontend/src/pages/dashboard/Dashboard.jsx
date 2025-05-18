import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Card,
  CardContent, 
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import AppointmentList from '../../components/modules/appointments/AppointmentList';
import { useAppointments } from '../../hooks/useAppointments';
import { useCustomers } from '../../hooks/useCustomers';
import { useReports } from '../../hooks/useReports';

// Renkler
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [appointmentsToday, setAppointmentsToday] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    completionRate: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  
  const { getAppointments } = useAppointments();
  const { countCustomers } = useCustomers();
  const { getDashboardStats, getWeeklyStats, getStatusStats } = useReports();
  
  // Dil için locale ayarı
  const locale = i18n.language === 'tr' ? tr : enUS;
  
  // Dashboard verilerini yükle
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Bugünün randevularını yükle
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        const todayAppointments = await getAppointments({
          startDate: startOfDay,
          endDate: endOfDay
        });
        
        setAppointmentsToday(todayAppointments);
        
        // İstatistikleri yükle
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
        
        // Haftalık verileri yükle
        const weeklyStats = await getWeeklyStats();
        
        // Gün adlarını çevir
        const translatedWeeklyStats = weeklyStats.map(item => ({
          ...item,
          day: t(`staff.${item.day.toLowerCase()}`)
        }));
        
        setWeeklyData(translatedWeeklyStats);
        
        // Durum verilerini yükle
        const statusStats = await getStatusStats();
        
        // Durum adlarını çevir
        const translatedStatusStats = statusStats.map(item => ({
          ...item,
          name: t(`appointments.${item.name.toLowerCase()}`)
        }));
        
        setStatusData(translatedStatusStats);
        
        setLoading(false);
      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [t, i18n.language]); // Dil değiştiğinde verileri yeniden yükle
  
  // Yükleme durumu
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.welcomeBack')}
      </Typography>
      
      {/* Üst kart istatistikleri */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">
                {t('dashboard.todayAppointments')}
              </Typography>
              <Typography variant="h4">
                {appointmentsToday.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">
                {t('dashboard.totalCustomers')}
              </Typography>
              <Typography variant="h4">
                {stats.totalCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">
                {t('dashboard.monthlyRevenue')}
              </Typography>
              <Typography variant="h4">
                {stats.totalRevenue} ₺
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">
                {t('dashboard.completionRate')}
              </Typography>
              <Typography variant="h4">
                {stats.completionRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Grafikler ve tablolar */}
      <Grid container spacing={3}>
        {/* Haftalık randevu istatistikleri grafiği */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.weeklyStats')}
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, t('dashboard.totalAppointments')]} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Durum verileri için pasta grafiği */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.appointmentsByStatus')}
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, t('dashboard.totalAppointments')]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Bugünkü randevular listesi */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('dashboard.todayAppointments')}
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/appointments')}
              >
                {t('dashboard.viewAll')}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {appointmentsToday.length > 0 ? (
              <AppointmentList 
                appointments={appointmentsToday}
                compact={true}
              />
            ) : (
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: l2 }}>
                {t('common.noData')}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;