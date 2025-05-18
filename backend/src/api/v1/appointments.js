const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/appointmentController');
const { protect } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validation');
const appointmentValidator = require('../../validators/appointment');

/**
 * @route GET /api/v1/appointments
 * @desc Get all appointments
 * @access Private
 */
router.get('/', protect, appointmentController.getAppointments);

/**
 * @route GET /api/v1/appointments/:id
 * @desc Get single appointment
 * @access Private
 */
router.get('/:id', protect, appointmentController.getAppointment);

/**
 * @route POST /api/v1/appointments
 * @desc Create new appointment
 * @access Private
 */
router.post(
  '/',
  protect,
  appointmentValidator.createAppointment,
  validate,
  appointmentController.createAppointment
);

/**
 * @route PUT /api/v1/appointments/:id
 * @desc Update appointment
 * @access Private
 */
router.put(
  '/:id',
  protect,
  appointmentValidator.updateAppointment,
  validate,
  appointmentController.updateAppointment
);

/**
 * @route DELETE /api/v1/appointments/:id
 * @desc Delete appointment
 * @access Private
 */
router.delete('/:id', protect, appointmentController.deleteAppointment);

/**
 * @route PATCH /api/v1/appointments/:id/status
 * @desc Update appointment status
 * @access Private
 */
router.patch(
  '/:id/status',
  protect,
  appointmentValidator.updateStatus,
  validate,
  appointmentController.updateAppointmentStatus
);

/**
 * @route GET /api/v1/appointments/check-availability
 * @desc Check staff availability for a time slot
 * @access Private
 */
router.get('/check-availability', protect, appointmentController.checkAvailability);

/**
 * @route GET /api/v1/appointments/daily-schedule
 * @desc Get appointments for a specific day
 * @access Private
 */
router.get('/daily-schedule', protect, appointmentController.getDailySchedule);

/**
 * @route GET /api/v1/appointments/weekly-schedule
 * @desc Get appointments for a week
 * @access Private
 */
router.get('/weekly-schedule', protect, appointmentController.getWeeklySchedule);

/**
 * @route GET /api/v1/appointments/staff-occupancy
 * @desc Get staff occupancy rate
 * @access Private
 */
router.get('/staff-occupancy', protect, appointmentController.getStaffOccupancyRate);

module.exports = router;