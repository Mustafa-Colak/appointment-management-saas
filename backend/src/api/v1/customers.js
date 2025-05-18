const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/customerController');
const { protect } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validation');
const customerValidator = require('../../validators/customer');

/**
 * @route GET /api/v1/customers
 * @desc Get all customers
 * @access Private
 */
router.get('/', protect, customerController.getCustomers);

/**
 * @route GET /api/v1/customers/count
 * @desc Get total number of customers
 * @access Private
 */
router.get('/count', protect, customerController.getCustomerCount);

/**
 * @route GET /api/v1/customers/:id
 * @desc Get single customer
 * @access Private
 */
router.get('/:id', protect, customerController.getCustomer);

/**
 * @route POST /api/v1/customers
 * @desc Create new customer
 * @access Private
 */
router.post(
  '/',
  protect,
  customerValidator.createCustomer,
  validate,
  customerController.createCustomer
);

/**
 * @route PUT /api/v1/customers/:id
 * @desc Update customer
 * @access Private
 */
router.put(
  '/:id',
  protect,
  customerValidator.updateCustomer,
  validate,
  customerController.updateCustomer
);

/**
 * @route DELETE /api/v1/customers/:id
 * @desc Delete customer
 * @access Private
 */
router.delete('/:id', protect, customerController.deleteCustomer);

/**
 * @route GET /api/v1/customers/:id/appointments
 * @desc Get customer appointments
 * @access Private
 */
router.get('/:id/appointments', protect, customerController.getCustomerAppointments);

/**
 * @route GET /api/v1/customers/:id/history
 * @desc Get customer history
 * @access Private
 */
router.get('/:id/history', protect, customerController.getCustomerHistory);

/**
 * @route POST /api/v1/customers/:id/history
 * @desc Add customer history record
 * @access Private
 */
router.post(
  '/:id/history',
  protect,
  customerValidator.addHistory,
  validate,
  customerController.addCustomerHistory
);

/**
 * @route POST /api/v1/customers/search
 * @desc Search customers
 * @access Private
 */
router.post('/search', protect, customerController.searchCustomers);

/**
 * @route GET /api/v1/customers/export
 * @desc Export customers
 * @access Private
 */
router.get('/export', protect, customerController.exportCustomers);

/**
 * @route POST /api/v1/customers/import
 * @desc Import customers
 * @access Private
 */
router.post('/import', protect, customerController.importCustomers);

module.exports = router;