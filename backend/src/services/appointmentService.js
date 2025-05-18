const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const { AppError } = require('../errors/AppError');
const NotificationService = require('./notificationService');

/**
 * Appointment Service
 * Handles business logic for appointment-related operations
 */
class AppointmentService {
  /**
   * Find all appointments with filters
   * @param {Object} filters - Filter options
   * @returns {Array} List of appointments
   */
  async findAll(filters = {}) {
    try {
      const query = Appointment.find(filters)
        .populate({
          path: 'customerId',
          select: 'firstName lastName email phone'
        })
        .populate({
          path: 'staffId',
          select: 'userId title',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        })
        .populate({
          path: 'serviceId',
          select: 'name duration price'
        })
        .sort({ startTime: 1 });

      // Apply pagination if provided
      if (filters.page && filters.limit) {
        const page = parseInt(filters.page, 10) || 1;
        const limit = parseInt(filters.limit, 10) || 10;
        const skip = (page - 1) * limit;

        query.skip(skip).limit(limit);
      }

      const appointments = await query;
      return appointments;
    } catch (error) {
      throw new AppError(`Randevular alınırken hata oluştu: ${error.message}`, 500);
    }
  }

  /**
   * Find appointment by ID
   * @param {string} id - Appointment ID
   * @param {string} tenantId - Tenant ID for security check
   * @returns {Object} Appointment object
   */
  async findById(id, tenantId) {
    try {
      const appointment = await Appointment.findOne({ _id: id, tenantId })
        .populate({
          path: 'customerId',
          select: 'firstName lastName email phone'
        })
        .populate({
          path: 'staffId',
          select: 'userId title',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        })
        .populate({
          path: 'serviceId',
          select: 'name duration price'
        });

      if (!appointment) {
        throw new AppError('Randevu bulunamadı', 404);
      }

      return appointment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Randevu alınırken hata oluştu: ${error.message}`, 500);
    }
  }

  /**
   * Create new appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Object} Created appointment
   */
  async create(appointmentData) {
    try {
      const { customerId, staffId, serviceId, startTime, tenantId } = appointmentData;

      // Validate required fields
      if (!customerId || !staffId || !serviceId || !startTime || !tenantId) {
        throw new AppError('Müşteri, personel, hizmet, başlangıç zamanı ve kiracı ID zorunludur', 400);
      }

      // Verify that customer, staff, and service exist
      const [customer, staff, service] = await Promise.all([
        Customer.findOne({ _id: customerId, tenantId }),
        Staff.findOne({ _id: staffId, tenantId }),
        Service.findOne({ _id: serviceId, tenantId })
      ]);

      if (!customer) {
        throw new AppError('Müşteri bulunamadı', 404);
      }

      if (!staff) {
        throw new AppError('Personel bulunamadı', 404);
      }

      if (!service) {
        throw new AppError('Hizmet bulunamadı', 404);
      }

      // Calculate end time if not provided
      let endTime = appointmentData.endTime;
      if (!endTime) {
        const startTimeDate = new Date(startTime);
        endTime = new Date(startTimeDate.getTime() + service.duration * 60 * 1000);
      }

      // Check staff availability
      const isAvailable = await this.checkAvailability(staffId, new Date(startTime), new Date(endTime));
      if (!isAvailable) {
        throw new AppError('Seçilen zaman diliminde personel müsait değil', 400);
      }

      // Create appointment
      const appointment = await Appointment.create({
        ...appointmentData,
        endTime
      });

      // Populate the appointment object
      const populatedAppointment = await Appointment.findById(appointment._id)
        .populate({
          path: 'customerId',
          select: 'firstName lastName email phone'
        })
        .populate({
          path: 'staffId',
          select: 'userId title',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        })
        .populate({
          path: 'serviceId',
          select: 'name duration price'
        });

      // Send confirmation notification
      try {
        await NotificationService.sendAppointmentConfirmation(populatedAppointment);
      } catch (notificationError) {
        console.error('Bildirim gönderilemedi:', notificationError);
        // Notification error should not block appointment creation
      }

      return populatedAppointment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Randevu oluşturulurken hata oluştu: ${error.message}`, 500);
    }
  }

  /**
   * Update appointment
   * @param {string} id - Appointment ID
   * @param {Object} appointmentData - Updated appointment data
   * @param {string} tenantId - Tenant ID for security check
   * @returns {Object} Updated appointment
   */
  async update(id, appointmentData, tenantId) {
    try {
      // Find the appointment
      const appointment = await Appointment.findOne({ _id: id, tenantId });
      
      if (!appointment) {
        throw new AppError('Randevu bulunamadı', 404);
      }

      // If updating time-related fields, check availability
      if (
        (appointmentData.startTime || appointmentData.endTime || appointmentData.staffId) &&
        appointmentData.status !== 'cancelled'
      ) {
        const startTime = appointmentData.startTime || appointment.startTime;
        const staffId = appointmentData.staffId || appointment.staffId;
        
        let endTime = appointmentData.endTime;
        
        // If updating start time but not end time, recalculate end time
        if (appointmentData.startTime && !appointmentData.endTime) {
          const service = await Service.findById(appointment.serviceId);
          const startTimeDate = new Date(startTime);
          endTime = new Date(startTimeDate.getTime() + service.duration * 60 * 1000);
        } else {
          endTime = endTime || appointment.endTime;
        }

        // Check staff availability
        const isAvailable = await this.checkAvailability(
          staffId,
          new Date(startTime),
          new Date(endTime),
          id // Exclude current appointment
        );
        
        if (!isAvailable) {
          throw new AppError('Seçilen zaman diliminde personel müsait değil', 400);
        }

        // Update end time in appointment data
        if (!appointmentData.endTime && appointmentData.startTime) {
          appointmentData.endTime = endTime;
        }
      }

      // Update appointment
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        appointmentData,
        { new: true, runValidators: true }
      ).populate({
        path: 'customerId',
        select: 'firstName lastName email phone'
      })
      .populate({
        path: 'staffId',
        select: 'userId title',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      })
      .populate({
        path: 'serviceId',
        select: 'name duration price'
      });

      // Send notification based on the update
      try {
        if (appointmentData.status === 'cancelled') {
          await NotificationService.sendAppointmentCancellation(updatedAppointment);
        } else if (appointmentData.startTime || appointmentData.endTime || appointmentData.staffId || appointmentData.serviceId) {
          await NotificationService.sendAppointmentUpdate(updatedAppointment);
        }
      } catch (notificationError) {
        console.error('Bildirim gönderilemedi:', notificationError);
        // Notification error should not block appointment update
      }

      return updatedAppointment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Randevu güncellenirken hata oluştu: ${error.message}`, 500);
    }
  }

  /**
   * Update appointment status
   * @param {string} id - Appointment ID
   * @param {string} status - New status
   * @param {string} tenantId - Tenant ID for security check
   * @returns {Object} Updated appointment
   */
  async updateStatus(id, status, tenantId) {
    try {
      // Validate status
      const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'];
      if (!validStatuses.includes(status)) {
        throw new AppError('Geçersiz randevu durumu', 400);
      }

      // Find the appointment
      const appointment = await Appointment.findOne({ _id: id, tenantId });
      
      if (!appointment) {
        throw new AppError('Randevu bulunamadı', 404);
      }

      // Update status
      appointment.status = status;
      
      // If cancelled, optionally add reason
      if (status === 'cancelled') {
        appointment.cancelledBy = 'staff'; // Default to staff
      }

      await appointment.save();

      // Populate the appointment object
      const populatedAppointment = await Appointment.findById(id)
        .populate({
          path: 'customerId',
          select: 'firstName lastName email phone'
        })
        .populate({
          path: 'staffId',
          select: 'userId title',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        })
        .populate({
          path: 'serviceId',
          select: 'name duration price'
        });

      // Send notification based on status change
      try {
        if (status === 'cancelled') {
          await NotificationService.sendAppointmentCancellation(populatedAppointment);
        } else if (status === 'confirmed') {
          await NotificationService.sendAppointmentConfirmation(populatedAppointment);
        }
      } catch (notificationError) {
        console.error('Bildirim gönderilemedi:', notificationError);
        // Notification error should not block status update
      }

      return populatedAppointment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Randevu durumu güncellenirken hata oluştu: ${error.message}`, 500);
    }
  }

  /**
   * Delete appointment
   * @param {string} id - Appointment ID
   * @param {string} tenantId - Tenant ID for security check
   * @returns {boolean} Success status
   */
  async delete(id, tenantId) {
    try {
      const appointment = await Appointment.findOne({ _id: id, tenantId })
        .populate({
          path: 'customerId',
          select: 'firstName lastName email phone'
        });
      
      if (!appointment) {
        throw new AppError('Randevu bulunamadı', 404);
      }

      // Send cancellation notification before deleting
      try {
        await NotificationService.sendAppointmentCancellation(appointment);
      } catch (notificationError) {
        console.error('İptal bildirimi gönderilemedi:', notificationError);
        // Notification error should not block deletion
      }

      // Delete the appointment
      await Appointment.deleteOne({ _id: id });

      return { success: true };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Randevu silinirken hata oluştu: ${error.message}`, 500);
    }
  }

  /**
   * Check staff availability for a time slot
   * @param {string} staffId - Staff ID
   * @param {Date} startTime - Start time
   * @param {Date} endTime - End time
   * @param {string} excludeAppointmentId - Optional appointment ID to exclude (for updates)
   * @returns {boolean} Availability status
   */
  async checkAvailability(staffId, startTime, endTime, excludeAppointmentId = null) {
    try {
      // Validate inputs
      if (!staffId || !startTime || !endTime) {
        throw new AppError('Personel ID, başlangıç ve bitiş zamanı gereklidir', 400);
      }

      if (startTime >= endTime) {
        throw new AppError('Başlangıç zamanı bitiş zamanından önce olmalıdır', 400);
      }

      // Check staff working hours (this would be implemented based on your staff model)
      // const isWithinWorkingHours = await this.checkWorkingHours(staffId, startTime, endTime);
      // if (!isWithinWorkingHours) {
      //   return false;
      // }

      // Find conflicting appointments
      const query = {
        staffId,
        status: { $nin: ['cancelled', 'no-show'] },
        $or: [
          // Start time is within existing appointment
          {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
          },
          // End time is within existing appointment
          {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
          },
          // New appointment fully contains existing appointment
          {
            startTime: { $gte: startTime },
            endTime: { $lte: endTime }
          },
          // Existing appointment fully contains new appointment
          {
            startTime: { $lte: startTime },
            endTime: { $gte: endTime }
          }
        ]
      };

      // Exclude current appointment (for updates)
      if (excludeAppointmentId) {
        query._id = { $ne: excludeAppointmentId };
      }

      const conflictingAppointments = await Appointment.find(query);
      
      // Return true if no conflicts found
      return conflictingAppointments.length === 0;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Müsaitlik kontrolü yapılırken hata oluştu: ${error.message}`, 500);
    }
  }

  /**
   * Get daily schedule
   * @param {Object} params - Query parameters
   * @param {string} tenantId - Tenant ID for security check
   * @returns {Array} List of appointments for the day
   */
  async getDailySchedule(params, tenantId) {
    try {
      const { date, staffId } = params;
      
      if (!date) {
        throw new AppError('Tarih parametresi gereklidir', 400);
      }

      // Create date range for the day
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Build query
      const query = {
        tenantId,
        startTime: { $gte: startDate, $lte: endDate }
      };

      if (staffId) {
        query.staffId = staffId;
      }

      // Get appointments
      const appointments = await Appointment.find(query)
        .sort('startTime')
        .populate({
          path: 'customerId',
          select: 'firstName lastName email phone'
        })
        .populate({
          path: 'staffId',
          select: 'userId title',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        })
        .populate({
          path: 'serviceId',
          select: 'name duration price'
        });

      return appointments;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Günlük program alınırken hata oluştu: ${error.message}`, 500);
    }
  }

  /**
   * Get weekly schedule
   * @param {Object} params - Query parameters
   * @param {string} tenantId - Tenant ID for security check
   * @returns {Array} List of appointments for the week
   */
  async getWeeklySchedule(params, tenantId) {
    try {
      const { startDate, endDate, staffId } = params;
      
      if (!startDate || !endDate) {
        throw new AppError('Başlangıç ve bitiş tarihi parametreleri gereklidir', 400);
      }

      // Build query
      const query = {
        tenantId,
        startTime: { $gte: new Date(startDate), $lte: new Date(endDate) }
      };

      if (staffId) {
        query.staffId = staffId;
      }

      // Get appointments
      const appointments = await Appointment.find(query)
        .sort('startTime')
        .populate({
          path: 'customerId',
          select: 'firstName lastName email phone'
        })
        .populate({
          path: 'staffId',
          select: 'userId title',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        })
        .populate({
          path: 'serviceId',
          select: 'name duration price'
        });

      return appointments;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Haftalık program alınırken hata oluştu: ${error.message}`, 500);
    }
  }

  /**
   * Get staff occupancy rate
   * @param {Object} params - Query parameters
   * @param {string} tenantId - Tenant ID for security check
   * @returns {Object} Occupancy rate information
   */
  async getStaffOccupancyRate(params, tenantId) {
    try {
      const { startDate, endDate, staffId } = params;
      
      if (!startDate || !endDate) {
        throw new AppError('Başlangıç ve bitiş tarihi parametreleri gereklidir', 400);
      }

      if (!staffId) {
        throw new AppError('Personel ID parametresi gereklidir', 400);
      }

      // Find staff
      const staff = await Staff.findOne({ _id: staffId, tenantId });
      
      if (!staff) {
        throw new AppError('Personel bulunamadı', 404);
      }

      // Set date range
      const startDateTime = new Date(startDate);
      startDateTime.setHours(0, 0, 0, 0);
      
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);

      // Get appointments
      const appointments = await Appointment.find({
        tenantId,
        staffId,
        status: { $nin: ['cancelled', 'no-show'] },
        startTime: { $gte: startDateTime, $lte: endDateTime }
      });

      const totalAppointments = appointments.length;
      
      // Calculate total appointment duration in minutes
      const totalAppointmentMinutes = appointments.reduce((sum, appointment) => {
        const duration = (new Date(appointment.endTime) - new Date(appointment.startTime)) / (1000 * 60);
        return sum + duration;
      }, 0);

      // TODO: Calculate occupancy rate based on staff working hours
      // This would require knowing the staff's working hours for the date range
      // const totalWorkingMinutes = ...
      // const occupancyRate = (totalAppointmentMinutes / totalWorkingMinutes) * 100;

      return {
        totalAppointments,
        totalAppointmentMinutes,
        // occupancyRate
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Personel doluluk oranı alınırken hata oluştu: ${error.message}`, 500);
    }
  }
}

module.exports = new AppointmentService();