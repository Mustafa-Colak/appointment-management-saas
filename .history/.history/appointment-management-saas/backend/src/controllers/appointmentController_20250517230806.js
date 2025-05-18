// Appointment controller
const AppointmentService = require("../services/appointmentService");
const NotificationService = require("../services/notificationService");
const AppError = require("../errors/AppError");

// Randevu listesini getir
exports.getAppointments = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { startDate, endDate, staffId, customerId, status } = req.query;
    
    const filters = { tenantId };
    
    if (startDate && endDate) {
      filters.startTime = { $gte: new Date(startDate) };
      filters.endTime = { $lte: new Date(endDate) };
    }
    
    if (staffId) filters.staffId = staffId;
    if (customerId) filters.customerId = customerId;
    if (status) filters.status = status;
    
    const appointments = await AppointmentService.findAll(filters);
    
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// Randevu detaylarını getir
exports.getAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    const appointment = await AppointmentService.findById(id, tenantId);
    
    if (!appointment) {
      return next(new AppError("Randevu bulunamadı", 404));
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// Yeni randevu oluştur
exports.createAppointment = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const appointmentData = {
      ...req.body,
      tenantId
    };
    
    // Müsaitlik kontrolü
    const isAvailable = await AppointmentService.checkAvailability(
      appointmentData.staffId,
      appointmentData.startTime,
      appointmentData.endTime
    );
    
    if (!isAvailable) {
      return next(new AppError("Seçilen zaman diliminde personel müsait değil", 400));
    }
    
    const appointment = await AppointmentService.create(appointmentData);
    
    // Bildirim gönder
    await NotificationService.sendAppointmentConfirmation(appointment);
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// Diğer fonksiyonlar...

