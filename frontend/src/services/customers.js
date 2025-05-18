import api from './api';

/**
 * Service for customer-related API calls
 */
const customerService = {
  /**
   * Get all customers with optional filters
   * @param {Object} filters - Query parameters for filtering customers
   * @returns {Promise<Array>} - List of customers
   */
  getAllCustomers: async (filters = {}) => {
    try {
      const response = await api.get('/customers', filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a specific customer by ID
   * @param {string} id - Customer ID
   * @returns {Promise<Object>} - Customer details
   */
  getCustomer: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise<Object>} - Created customer
   */
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing customer
   * @param {string} id - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise<Object>} - Updated customer
   */
  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a customer
   * @param {string} id - Customer ID
   * @returns {Promise<Object>} - Deletion response
   */
  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get customer appointments
   * @param {string} id - Customer ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - List of customer appointments
   */
  getCustomerAppointments: async (id, filters = {}) => {
    try {
      const response = await api.get(`/customers/${id}/appointments`, filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get customer history
   * @param {string} id - Customer ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - List of customer history records
   */
  getCustomerHistory: async (id, filters = {}) => {
    try {
      const response = await api.get(`/customers/${id}/history`, filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add history record for a customer
   * @param {string} id - Customer ID
   * @param {Object} historyData - History record data
   * @returns {Promise<Object>} - Created history record
   */
  addCustomerHistory: async (id, historyData) => {
    try {
      const response = await api.post(`/customers/${id}/history`, historyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Count total customers
   * @returns {Promise<number>} - Total customer count
   */
  countCustomers: async () => {
    try {
      const response = await api.get('/customers/count');
      return response.data.count;
    } catch (error) {
      throw error;
    }
  }
};

export default customerService;