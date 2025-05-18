const EmailService = require('./emailService');
const SmsService = require('./smsService');
const User = require('../models/User');
const Customer = require('../models/Customer');
const { AppError } = require('../errors/AppError');

class NotificationService {
  // Randevu onay bildirimi gönder
  async sendAppointmentConfirmation(appointment) {
    try {
      if (!appointment || !appointment.customerId) {
        throw new AppError('Geçersiz randevu veya müşteri bilgisi', 400);
      }

      // Müşteri ve ilgili kullanıcı bilgilerini al
      const customer = await Customer.findById(appointment.customerId);
      
      if (!customer) {
        throw new AppError('Müşteri bulunamadı', 404);
      }

      // Randevu bilgilerini hazırla
      const appointmentDate = new Date(appointment.startTime).toLocaleDateString('tr-TR');
      const appointmentTime = new Date(appointment.startTime).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Servis adını al
      let serviceName = 'Belirtilmemiş';
      if (appointment.serviceId && appointment.serviceId.name) {
        serviceName = appointment.serviceId.name;
      }

      // Personel adını al
      let staffName = 'Belirtilmemiş';
      if (appointment.staffId && appointment.staffId.userId) {
        staffName = `${appointment.staffId.userId.firstName} ${appointment.staffId.userId.lastName}`;
      }

      // E-posta ve SMS gönderimi
      const promises = [];

      // E-posta gönderimi
      if (customer.email) {
        const emailData = {
          to: customer.email,
          subject: 'Randevu Onayı',
          template: 'appointment-confirmation',
          data: {
            customerName: `${customer.firstName} ${customer.lastName}`,
            appointmentDate,
            appointmentTime,
            serviceName,
            staffName,
            appointmentId: appointment._id
          }
        };

        promises.push(EmailService.sendEmail(emailData));
      }

      // SMS gönderimi
      if (customer.phone && customer.marketingConsent && customer.marketingConsent.sms) {
        const smsText = `Sayın ${customer.firstName} ${customer.lastName}, ${appointmentDate} tarihinde saat ${appointmentTime} için ${serviceName} randevunuz onaylanmıştır. Personel: ${staffName}`;
        
        promises.push(SmsService.sendSms(customer.phone, smsText));
      }

      // Bildirimleri gönder
      await Promise.all(promises);

      // Randevu onay durumunu güncelle
      appointment.confirmationSent = true;
      await appointment.save();

      return true;
    } catch (error) {
      console.error('Randevu onay bildirimi gönderme hatası:', error);
      throw error;
    }
  }

  // Randevu iptal bildirimi gönder
  async sendAppointmentCancellation(appointment) {
    try {
      if (!appointment || !appointment.customerId) {
        throw new AppError('Geçersiz randevu veya müşteri bilgisi', 400);
      }

      // Müşteri bilgilerini al
      const customer = await Customer.findById(appointment.customerId);
      
      if (!customer) {
        throw new AppError('Müşteri bulunamadı', 404);
      }

      // Randevu bilgilerini hazırla
      const appointmentDate = new Date(appointment.startTime).toLocaleDateString('tr-TR');
      const appointmentTime = new Date(appointment.startTime).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // E-posta ve SMS gönderimi
      const promises = [];

      // E-posta gönderimi
      if (customer.email) {
        const emailData = {
          to: customer.email,
          subject: 'Randevu İptali',
          template: 'appointment-cancellation',
          data: {
            customerName: `${customer.firstName} ${customer.lastName}`,
            appointmentDate,
            appointmentTime,
            cancellationReason: appointment.cancelledReason || 'Belirtilmemiş'
          }
        };

        promises.push(EmailService.sendEmail(emailData));
      }

      // SMS gönderimi
      if (customer.phone && customer.marketingConsent && customer.marketingConsent.sms) {
        const smsText = `Sayın ${customer.firstName} ${customer.lastName}, ${appointmentDate} tarihinde saat ${appointmentTime} için randevunuz iptal edilmiştir.`;
        
        promises.push(SmsService.sendSms(customer.phone, smsText));
      }

      // Bildirimleri gönder
      await Promise.all(promises);

      return true;
    } catch (error) {
      console.error('Randevu iptal bildirimi gönderme hatası:', error);
      throw error;
    }
  }

  // Randevu güncelleme bildirimi gönder
  async sendAppointmentUpdate(appointment) {
    try {
      if (!appointment || !appointment.customerId) {
        throw new AppError('Geçersiz randevu veya müşteri bilgisi', 400);
      }

      // Müşteri bilgilerini al
      const customer = await Customer.findById(appointment.customerId);
      
      if (!customer) {
        throw new AppError('Müşteri bulunamadı', 404);
      }

      // Randevu bilgilerini hazırla
      const appointmentDate = new Date(appointment.startTime).toLocaleDateString('tr-TR');
      const appointmentTime = new Date(appointment.startTime).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Servis adını al
      let serviceName = 'Belirtilmemiş';
      if (appointment.serviceId && appointment.serviceId.name) {
        serviceName = appointment.serviceId.name;
      }

      // Personel adını al
      let staffName = 'Belirtilmemiş';
      if (appointment.staffId && appointment.staffId.userId) {
        staffName = `${appointment.staffId.userId.firstName} ${appointment.staffId.userId.lastName}`;
      }

      // E-posta ve SMS gönderimi
      const promises = [];

      // E-posta gönderimi
      if (customer.email) {
        const emailData = {
          to: customer.email,
          subject: 'Randevu Güncelleme',
          template: 'appointment-update',
          data: {
            customerName: `${customer.firstName} ${customer.lastName}`,
            appointmentDate,
            appointmentTime,
            serviceName,
            staffName,
            appointmentId: appointment._id
          }
        };

        promises.push(EmailService.sendEmail(emailData));
      }

      // SMS gönderimi
      if (customer.phone && customer.marketingConsent && customer.marketingConsent.sms) {
        const smsText = `Sayın ${customer.firstName} ${customer.lastName}, randevunuz güncellendi. Yeni randevu: ${appointmentDate} tarihinde saat ${appointmentTime}, ${serviceName}. Personel: ${staffName}`;
        
        promises.push(SmsService.sendSms(customer.phone, smsText));
      }

      // Bildirimleri gönder
      await Promise.all(promises);

      return true;
    } catch (error) {
      console.error('Randevu güncelleme bildirimi gönderme hatası:', error);
      throw error;
    }
  }

  // Randevu hatırlatıcı gönder
  async sendAppointmentReminder(appointment) {
    try {
      if (!appointment || !appointment.customerId) {
        throw new AppError('Geçersiz randevu veya müşteri bilgisi', 400);
      }

      // Müşteri bilgilerini al
      const customer = await Customer.findById(appointment.customerId);
      
      if (!customer) {
        throw new AppError('Müşteri bulunamadı', 404);
      }

      // Randevu bilgilerini hazırla
      const appointmentDate = new Date(appointment.startTime).toLocaleDateString('tr-TR');
      const appointmentTime = new Date(appointment.startTime).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Servis adını al
      let serviceName = 'Belirtilmemiş';
      if (appointment.serviceId && appointment.serviceId.name) {
        serviceName = appointment.serviceId.name;
      }

      // E-posta ve SMS gönderimi
      const promises = [];

      // E-posta gönderimi
      if (customer.email) {
        const emailData = {
          to: customer.email,
          subject: 'Randevu Hatırlatması',
          template: 'appointment-reminder',
          data: {
            customerName: `${customer.firstName} ${customer.lastName}`,
            appointmentDate,
            appointmentTime,
            serviceName,
            appointmentId: appointment._id
          }
        };

        promises.push(EmailService.sendEmail(emailData));
      }

      // SMS gönderimi
      if (customer.phone && customer.marketingConsent && customer.marketingConsent.sms) {
        const smsText = `Sayın ${customer.firstName} ${customer.lastName}, yarın (${appointmentDate}) saat ${appointmentTime} için ${serviceName} randevunuzu hatırlatırız.`;
        
        promises.push(SmsService.sendSms(customer.phone, smsText));
      }

      // Bildirimleri gönder
      await Promise.all(promises);

      // Randevu hatırlatma durumunu güncelle
      appointment.reminderSent = true;
      await appointment.save();

      return true;
    } catch (error) {
      console.error('Randevu hatırlatma bildirimi gönderme hatası:', error);
      throw error;
    }
  }

  // Toplu bildirim gönder
  async sendBulkNotification(customers, subject, message, sendSms = false) {
    try {
      if (!customers || !customers.length) {
        throw new AppError('Geçerli müşteri listesi gereklidir', 400);
      }

      const emailPromises = [];
      const smsPromises = [];

      // Tüm müşterilere bildirim gönder
      for (const customer of customers) {
        // E-posta gönderimi
        if (customer.email) {
          const emailData = {
            to: customer.email,
            subject,
            template: 'general-notification',
            data: {
              customerName: `${customer.firstName} ${customer.lastName}`,
              message
            }
          };

          emailPromises.push(EmailService.sendEmail(emailData));
        }

        // SMS gönderimi
        if (sendSms && customer.phone && customer.marketingConsent && customer.marketingConsent.sms) {
          const smsText = `Sayın ${customer.firstName} ${customer.lastName}, ${message}`;
          
          smsPromises.push(SmsService.sendSms(customer.phone, smsText));
        }
      }

      // E-postaları gönder
      await Promise.all(emailPromises);

      // SMS'leri gönder
      if (sendSms) {
        await Promise.all(smsPromises);
      }

      return {
        success: true,
        emailCount: emailPromises.length,
        smsCount: smsPromises.length
      };
    } catch (error) {
      console.error('Toplu bildirim gönderme hatası:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();