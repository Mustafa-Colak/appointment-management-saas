import api from './api';

/**
 * Service for appointment-related API calls
 */
const appointmentService = {
  /**
   * Get all appointments with optional filters
   * @param {Object} filters - Query parameters for filtering appointments
   * @returns {Promise<Array>} - List of appointments
   */
  getAppointments: async (filters = {}) => {
    try {
      const response = await api.get('/appointments', filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a specific appointment by ID
   * @param {string} id - Appointment ID
   * @returns {Promise<Object>} - Appointment details
   */
  getAppointment: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise<Object>} - Created appointment
   */
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing appointment
   * @param {string} id - Appointment ID
   * @param {Object} appointmentData - Updated appointment data
   * @returns {Promise<Object>} - Updated appointment
   */
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete an appointment
   * @param {string} id - Appointment ID
   * @returns {Promise<Object>} - Deletion response
   */
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update the status of an appointment
   * @param {string} id - Appointment ID
   * @param {string} status - New status ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')
   * @returns {Promise<Object>} - Updated appointment
   */
  updateAppointmentStatus: async (id, status) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check availability for a time slot
   * @param {Object} params - Params including staffId, startTime, endTime
   * @returns {Promise<Object>} - Availability information
   */
  checkAvailability: async (params) => {
    try {
      const response = await api.get('/appointments/check-availability', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get daily schedule
   * @param {Object} params - Query parameters including date and staffId
   * @returns {Promise<Array>} - List of appointments for the day
   */
  getDailySchedule: async (params) => {
    try {
      const response = await api.get('/appointments/daily-schedule', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get weekly schedule
   * @param {Object} params - Query parameters including startDate, endDate, and staffId
   * @returns {Promise<Array>} - List of appointments for the week
   */
  getWeeklySchedule: async (params) => {
    try {
      const response = await api.get('/appointments/weekly-schedule', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default appointmentService;