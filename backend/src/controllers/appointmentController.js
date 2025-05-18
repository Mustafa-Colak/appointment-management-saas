const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const Staff = require("../models/Staff");
const Customer = require("../models/Customer");
const NotificationService = require("../services/notificationService");
const { AppError } = require("../errors/AppError");

// Tüm randevuları getir
exports.getAppointments = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { 
      startDate, 
      endDate, 
      staffId, 
      customerId, 
      status,
      page = 1,
      limit = 50,
      sort = '-startTime'
    } = req.query;
    
    // Filtreleme
    const filters = { tenantId };
    
    // Tarih filtresi
    if (startDate && endDate) {
      filters.startTime = { $gte: new Date(startDate) };
      filters.endTime = { $lte: new Date(endDate) };
    } else if (startDate) {
      filters.startTime = { $gte: new Date(startDate) };
    } else if (endDate) {
      filters.startTime = { $lte: new Date(endDate) };
    }
    
    // Diğer filtreler
    if (staffId) filters.staffId = staffId;
    if (customerId) filters.customerId = customerId;
    if (status) filters.status = status;
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Query
    const appointments = await Appointment.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: "customerId",
        select: "firstName lastName email phone"
      })
      .populate({
        path: "staffId",
        select: "userId title",
        populate: {
          path: "userId",
          select: "firstName lastName"
        }
      })
      .populate({
        path: "serviceId",
        select: "name duration price"
      });
    
    // Toplam kayıt sayısı
    const total = await Appointment.countDocuments(filters);
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      },
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// Tek bir randevuyu getir
exports.getAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    const appointment = await Appointment.findOne({ _id: id, tenantId })
      .populate({
        path: "customerId",
        select: "firstName lastName email phone"
      })
      .populate({
        path: "staffId",
        select: "userId title",
        populate: {
          path: "userId",
          select: "firstName lastName"
        }
      })
      .populate({
        path: "serviceId",
        select: "name duration price"
      });
    
    if (!appointment) {
      return next(new AppError("Randevu bulunamadı", 404));
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Yeni randevu oluştur
exports.createAppointment = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { customerId, staffId, serviceId, startTime, endTime, notes, status } = req.body;
    
    // Gerekli alanları kontrol et
    if (!customerId || !staffId || !serviceId || !startTime) {
      return next(new AppError("Müşteri, personel, hizmet ve başlangıç zamanı zorunludur", 400));
    }
    
    // Müşteri, personel ve hizmet varlığını kontrol et
    const [customer, staff, service] = await Promise.all([
      Customer.findOne({ _id: customerId, tenantId }),
      Staff.findOne({ _id: staffId, tenantId }),
      Service.findOne({ _id: serviceId, tenantId })
    ]);
    
    if (!customer) {
      return next(new AppError("Müşteri bulunamadı", 404));
    }
    
    if (!staff) {
      return next(new AppError("Personel bulunamadı", 404));
    }
    
    if (!service) {
      return next(new AppError("Hizmet bulunamadı", 404));
    }
    
    // Bitiş zamanı belirtilmemişse hesapla
    let appointmentEndTime = endTime ? new Date(endTime) : null;
    
    if (!appointmentEndTime) {
      const startTimeDate = new Date(startTime);
      appointmentEndTime = new Date(startTimeDate.getTime() + service.duration * 60 * 1000);
    }
    
    // Müsaitlik kontrolü
    const isAvailable = await checkAvailability(staffId, new Date(startTime), appointmentEndTime);
    
    if (!isAvailable) {
      return next(new AppError("Seçilen zaman diliminde personel müsait değil", 400));
    }
    
    // Yeni randevu oluştur
    const appointment = await Appointment.create({
      tenantId,
      customerId,
      staffId,
      serviceId,
      startTime: new Date(startTime),
      endTime: appointmentEndTime,
      status: status || "scheduled",
      notes
    });
    
    // Yeni oluşturulan randevuyu popülasyonla birlikte getir
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "customerId",
        select: "firstName lastName email phone"
      })
      .populate({
        path: "staffId",
        select: "userId title",
        populate: {
          path: "userId",
          select: "firstName lastName"
        }
      })
      .populate({
        path: "serviceId",
        select: "name duration price"
      });
    
    // Bildirim gönder
    if (status !== "cancelled") {
      try {
        await NotificationService.sendAppointmentConfirmation(populatedAppointment);
      } catch (notificationError) {
        console.error("Bildirim gönderilemedi:", notificationError);
        // Bildirim hatası randevu oluşturmayı engellemez
      }
    }
    
    res.status(201).json({
      success: true,
      data: populatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// Randevu güncelle
exports.updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { 
      customerId, 
      staffId, 
      serviceId, 
      startTime, 
      endTime, 
      status, 
      notes,
      reminderSent
    } = req.body;
    
    // Randevuyu bul
    let appointment = await Appointment.findOne({ _id: id, tenantId });
    
    if (!appointment) {
      return next(new AppError("Randevu bulunamadı", 404));
    }
    
    const updateData = {};
    
    // Güncelleme verileri hazırla
    if (customerId) updateData.customerId = customerId;
    if (staffId) updateData.staffId = staffId;
    if (serviceId) updateData.serviceId = serviceId;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (reminderSent !== undefined) updateData.reminderSent = reminderSent;
    
    // Bitiş zamanı yoksa ve başlangıç zamanı güncellendiyse
    if (startTime && !endTime) {
      const service = await Service.findById(appointment.serviceId);
      const startTimeDate = new Date(startTime);
      updateData.endTime = new Date(startTimeDate.getTime() + service.duration * 60 * 1000);
    }
    
    // Zaman değişikliği varsa müsaitlik kontrolü
    if ((startTime || endTime) && staffId) {
      const checkStaffId = staffId || appointment.staffId;
      const checkStartTime = startTime ? new Date(startTime) : appointment.startTime;
      const checkEndTime = updateData.endTime || appointment.endTime;
      
      const isAvailable = await checkAvailability(
        checkStaffId,
        checkStartTime,
        checkEndTime,
        id
      );
      
      if (!isAvailable) {
        return next(new AppError("Seçilen zaman diliminde personel müsait değil", 400));
      }
    }
    
    // Randevuyu güncelle
    appointment = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
    .populate({
      path: "customerId",
      select: "firstName lastName email phone"
    })
    .populate({
      path: "staffId",
      select: "userId title",
      populate: {
        path: "userId",
        select: "firstName lastName"
      }
    })
    .populate({
      path: "serviceId",
      select: "name duration price"
    });
    
    // Bildirim gönder
    if (status === "cancelled") {
      try {
        await NotificationService.sendAppointmentCancellation(appointment);
      } catch (notificationError) {
        console.error("İptal bildirimi gönderilemedi:", notificationError);
      }
    } else if (startTime || endTime || staffId || serviceId) {
      try {
        await NotificationService.sendAppointmentUpdate(appointment);
      } catch (notificationError) {
        console.error("Güncelleme bildirimi gönderilemedi:", notificationError);
      }
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Randevu sil
exports.deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    // Randevuyu bul
    const appointment = await Appointment.findOne({ _id: id, tenantId });
    
    if (!appointment) {
      return next(new AppError("Randevu bulunamadı", 404));
    }
    
    // İptal bildirimi gönder
    try {
      await NotificationService.sendAppointmentCancellation(appointment);
    } catch (notificationError) {
      console.error("İptal bildirimi gönderilemedi:", notificationError);
    }
    
    // Randevuyu sil
    await Appointment.deleteOne({ _id: id });
    
    res.status(200).json({
      success: true,
      message: "Randevu başarıyla silindi"
    });
  } catch (error) {
    next(error);
  }
};

// Müsaitlik kontrolü
exports.checkAvailability = async (req, res, next) => {
  try {
    const { staffId, startTime, endTime, excludeAppointmentId } = req.query;
    
    if (!staffId || !startTime || !endTime) {
      return next(new AppError("Personel ID, başlangıç ve bitiş zamanı gereklidir", 400));
    }
    
    const isAvailable = await checkAvailability(
      staffId,
      new Date(startTime),
      new Date(endTime),
      excludeAppointmentId
    );
    
    res.status(200).json({
      success: true,
      available: isAvailable
    });
  } catch (error) {
    next(error);
  }
};

// Personel müsaitliğini kontrol et (yardımcı fonksiyon)
const checkAvailability = async (staffId, startTime, endTime, excludeAppointmentId = null) => {
  // Aynı personel için çakışan randevuları bul
  const query = {
    staffId,
    status: { $nin: ["cancelled", "no-show"] },
    $or: [
      // startTime, mevcut randevular arasında
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      },
      // endTime, mevcut randevular arasında
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      },
      // Yeni randevu, mevcut randevunun içinde
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime }
      },
      // Mevcut randevu, yeni randevunun içinde
      {
        startTime: { $lte: startTime },
        endTime: { $gte: endTime }
      }
    ]
  };
  
  // Belirli bir randevu hariç kontrol et
  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }
  
  const conflictingAppointments = await Appointment.find(query);
  
  return conflictingAppointments.length === 0;
};

// Günlük randevu takvimini getir
exports.getDailySchedule = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { date, staffId } = req.query;
    
    if (!date) {
      return next(new AppError("Tarih parametresi gereklidir", 400));
    }
    
    // Verilen tarihin başlangıç ve bitiş zamanlarını hesapla
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Filtreleme
    const filters = {
      tenantId,
      startTime: { $gte: startOfDay, $lte: endOfDay }
    };
    
    if (staffId) {
      filters.staffId = staffId;
    }
    
    // Randevuları getir
    const appointments = await Appointment.find(filters)
      .sort("startTime")
      .populate({
        path: "customerId",
        select: "firstName lastName email phone"
      })
      .populate({
        path: "staffId",
        select: "userId title",
        populate: {
          path: "userId",
          select: "firstName lastName"
        }
      })
      .populate({
        path: "serviceId",
        select: "name duration price"
      });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// Haftalık randevu takvimini getir
exports.getWeeklySchedule = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { startDate, endDate, staffId } = req.query;
    
    if (!startDate || !endDate) {
      return next(new AppError("Başlangıç ve bitiş tarihi parametreleri gereklidir", 400));
    }
    
    // Filtreleme
    const filters = {
      tenantId,
      startTime: { $gte: new Date(startDate), $lte: new Date(endDate) }
    };
    
    if (staffId) {
      filters.staffId = staffId;
    }
    
    // Randevuları getir
    const appointments = await Appointment.find(filters)
      .sort("startTime")
      .populate({
        path: "customerId",
        select: "firstName lastName email phone"
      })
      .populate({
        path: "staffId",
        select: "userId title",
        populate: {
          path: "userId",
          select: "firstName lastName"
        }
      })
      .populate({
        path: "serviceId",
        select: "name duration price"
      });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// Personel bazında haftalık doluluk oranı
exports.getStaffOccupancyRate = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { startDate, endDate, staffId } = req.query;
    
    if (!startDate || !endDate) {
      return next(new AppError("Başlangıç ve bitiş tarihi parametreleri gereklidir", 400));
    }
    
    if (!staffId) {
      return next(new AppError("Personel ID parametresi gereklidir", 400));
    }
    
    // Personeli bul
    const staff = await Staff.findOne({ _id: staffId, tenantId });
    
    if (!staff) {
      return next(new AppError("Personel bulunamadı", 404));
    }
    
    // Tarih aralığını belirle
    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    
    // Randevuları getir
    const appointments = await Appointment.find({
      tenantId,
      staffId,
      status: { $nin: ["cancelled", "no-show"] },
      startTime: { $gte: startDateTime, $lte: endDateTime }
    });
    
    // TODO: Personelin çalışma saatlerine göre doluluk oranını hesapla
    // Burada personelin çalışma saatlerine göre doluluk oranı hesaplanabilir
    
    const totalAppointments = appointments.length;
    
    // Toplam randevu süresi (dakika)
    const totalAppointmentMinutes = appointments.reduce((sum, appointment) => {
      const duration = (new Date(appointment.endTime) - new Date(appointment.startTime)) / (1000 * 60);
      return sum + duration;
    }, 0);
    
    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        totalAppointmentMinutes,
        // TODO: Doluluk oranı, personelin çalışma saatlerine göre hesaplanmalı
        occupancyRate: null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  checkAvailability,
  getDailySchedule,
  getWeeklySchedule,
  getStaffOccupancyRate
};