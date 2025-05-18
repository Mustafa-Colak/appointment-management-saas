import api from './api';

/**
 * Service for service-related API calls
 */
const serviceService = {
  /**
   * Get all services with optional filters
   * @param {Object} filters - Query parameters for filtering services
   * @returns {Promise<Array>} - List of services
   */
  getAllServices: async (filters = {}) => {
    try {
      const response = await api.get('/services', filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a specific service by ID
   * @param {string} id - Service ID
   * @returns {Promise<Object>} - Service details
   */
  getService: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new service
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object>} - Created service
   */
  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing service
   * @param {string} id - Service ID
   * @param {Object} serviceData - Updated service data
   * @returns {Promise<Object>} - Updated service
   */
  updateService: async (id, serviceData) => {
    try {
      const response = await api.put(`/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a service
   * @param {string} id - Service ID
   * @returns {Promise<Object>} - Deletion response
   */
  deleteService: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get services by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} - List of services in the category
   */
  getServicesByCategory: async (category) => {
    try {
      const response = await api.get('/services/category/' + category);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all service categories
   * @returns {Promise<Array>} - List of service categories
   */
  getCategories: async () => {
    try {
      const response = await api.get('/services/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Assign staff to a service
   * @param {string} id - Service ID
   * @param {Array} staffIds - Array of staff IDs
   * @returns {Promise<Object>} - Updated service
   */
  assignStaff: async (id, staffIds) => {
    try {
      const response = await api.post(`/services/${id}/staff`, { staffIds });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default serviceService;