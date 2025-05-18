const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { AppError } = require('../errors/AppError');

class EmailService {
  constructor() {
    // E-posta gönderici yapılandırması
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // E-posta şablonları
    this.templates = {
      'appointment-confirmation': this.getTemplate('appointment-confirmation'),
      'appointment-cancellation': this.getTemplate('appointment-cancellation'),
      'appointment-reminder': this.getTemplate('appointment-reminder'),
      'appointment-update': this.getTemplate('appointment-update'),
      'password-reset': this.getTemplate('password-reset'),
      'welcome': this.getTemplate('welcome'),
      'general-notification': this.getTemplate('general-notification')
    };
  }

  // Şablon içeriğini oku
  getTemplate(templateName) {
    try {
      // Gerçek uygulamada şablon dosyalarını okuma
      // Bu örnek için basit bir şablon string'i döndürüyoruz
      const templates = {
        'appointment-confirmation': 'Sayın {{customerName}}, {{appointmentDate}} tarihinde saat {{appointmentTime}} için {{serviceName}} randevunuz onaylanmıştır.',
        'appointment-cancellation': 'Sayın {{customerName}}, {{appointmentDate}} tarihinde saat {{appointmentTime}} için randevunuz iptal edilmiştir. İptal nedeni: {{cancellationReason}}',
        'appointment-reminder': 'Sayın {{customerName}}, {{appointmentDate}} tarihinde saat {{appointmentTime}} için {{serviceName}} randevunuzu hatırlatırız.',
        'appointment-update': 'Sayın {{customerName}}, randevunuz güncellendi. Yeni randevu: {{appointmentDate}} tarihinde saat {{appointmentTime}}, {{serviceName}}.',
        'password-reset': 'Sayın {{customerName}}, şifre sıfırlama bağlantınız: {{resetLink}}',
        'welcome': 'Sayın {{customerName}}, uygulamamıza hoş geldiniz!',
        'general-notification': 'Sayın {{customerName}}, {{message}}'
      };

      return templates[templateName] || 'Şablon bulunamadı';
    } catch (error) {
      console.error(`Şablon okuma hatası (${templateName}):`, error);
      return 'Şablon yüklenemedi.';
    }
  }

  // Şablonu verilerle doldur
  compileTemplate(template, data) {
    return Object.keys(data).reduce((compiledTemplate, key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      return compiledTemplate.replace(regex, data[key]);
    }, template);
  }

  // E-posta gönder
  async sendEmail({ to, subject, template, data, attachments = [] }) {
    try {
      if (!to || !subject || !template) {
        throw new AppError('Alıcı e-posta, konu ve şablon gereklidir', 400);
      }

      // Şablonu bul
      const templateContent = this.templates[template];
      if (!templateContent) {
        throw new AppError(`${template} şablonu bulunamadı`, 404);
      }

      // Şablonu verilerle doldur
      const html = this.compileTemplate(templateContent, data || {});

      // E-posta gönderimi
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@randevusistemi.com',
        to,
        subject,
        html,
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('E-posta gönderildi:', info.messageId);
      return info;
    } catch (error) {
      console.error('E-posta gönderme hatası:', error);
      throw new AppError(`E-posta gönderilemedi: ${error.message}`, 500);
    }
  }

  // Toplu e-posta gönder
  async sendBulkEmail(recipients, subject, template, data) {
    try {
      if (!recipients || !recipients.length) {
        throw new AppError('Alıcı listesi gereklidir', 400);
      }

      const promises = recipients.map(recipient => 
        this.sendEmail({
          to: recipient.email,
          subject,
          template,
          data: { ...data, customerName: `${recipient.firstName} ${recipient.lastName}` }
        })
      );

      return await Promise.all(promises);
    } catch (error) {
      console.error('Toplu e-posta gönderme hatası:', error);
      throw new AppError(`Toplu e-posta gönderilemedi: ${error.message}`, 500);
    }
  }

  // Şifre sıfırlama e-postası gönder
  async sendPasswordResetEmail(email, resetUrl) {
    try {
      await this.sendEmail({
        to: email,
        subject: 'Şifre Sıfırlama',
        template: 'password-reset',
        data: {
          resetLink: resetUrl,
          customerName: 'Değerli Kullanıcımız'
        }
      });

      return true;
    } catch (error) {
      console.error('Şifre sıfırlama e-postası gönderme hatası:', error);
      throw error;
    }
  }

  // Hoş geldiniz e-postası gönder
  async sendWelcomeEmail(customer) {
    try {
      await this.sendEmail({
        to: customer.email,
        subject: 'Hoş Geldiniz',
        template: 'welcome',
        data: {
          customerName: `${customer.firstName} ${customer.lastName}`
        }
      });

      return true;
    } catch (error) {
      console.error('Hoş geldiniz e-postası gönderme hatası:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();