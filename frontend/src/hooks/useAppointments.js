// useAppointments hook
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
};
