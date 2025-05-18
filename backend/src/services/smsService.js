const { AppError } = require('../errors/AppError');

class SmsService {
  constructor() {
    // SMS sağlayıcısı yapılandırması
    this.apiKey = process.env.SMS_API_KEY;
    this.sender = process.env.SMS_SENDER || 'RANDEVU';
  }

  // SMS gönder
  async sendSms(phoneNumber, message) {
    try {
      if (!phoneNumber || !message) {
        throw new AppError('Telefon numarası ve mesaj gereklidir', 400);
      }

      // Telefon numarasını formatlama
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // Gerçek bir SMS API entegrasyonu yerine simüle ediyoruz
      console.log(`SMS gönderildi - Alıcı: ${formattedPhone}, Mesaj: ${message}`);

      // Gerçek bir SMS sağlayıcısı için API çağrısı:
      // const response = await axios.post('SMS_API_URL', {
      //   apiKey: this.apiKey,
      //   to: formattedPhone,
      //   from: this.sender,
      //   message
      // });

      return {
        success: true,
        recipient: formattedPhone,
        messageId: `SMS_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      };
    } catch (error) {
      console.error('SMS gönderme hatası:', error);
      throw new AppError(`SMS gönderilemedi: ${error.message}`, 500);
    }
  }

  // Toplu SMS gönder
  async sendBulkSms(phoneNumbers, message) {
    try {
      if (!phoneNumbers || !phoneNumbers.length) {
        throw new AppError('Telefon numaraları listesi gereklidir', 400);
      }

      if (!message) {
        throw new AppError('SMS mesajı gereklidir', 400);
      }

      // Telefon numaralarını formatlama
      const formattedPhones = phoneNumbers.map(phone => this.formatPhoneNumber(phone));

      // Gerçek bir SMS API entegrasyonu yerine simüle ediyoruz
      console.log(`Toplu SMS gönderildi - Alıcılar: ${formattedPhones.join(', ')}, Mesaj: ${message}`);

      // Gerçek bir SMS sağlayıcısı için API çağrısı:
      // const response = await axios.post('SMS_API_URL', {
      //   apiKey: this.apiKey,
      //   to: formattedPhones,
      //   from: this.sender,
      //   message
      // });

      return {
        success: true,
        recipientCount: formattedPhones.length,
        messageId: `BULK_SMS_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      };
    } catch (error) {
      console.error('Toplu SMS gönderme hatası:', error);
      throw new AppError(`Toplu SMS gönderilemedi: ${error.message}`, 500);
    }
  }

  // Kişiselleştirilmiş toplu SMS gönder
  async sendPersonalizedBulkSms(recipients, messageTemplate) {
    try {
      if (!recipients || !recipients.length) {
        throw new AppError('Alıcı listesi gereklidir', 400);
      }

      if (!messageTemplate) {
        throw new AppError('SMS mesaj şablonu gereklidir', 400);
      }

      const promises = recipients.map(recipient => {
        // Mesajı kişiselleştir
        const personalizedMessage = this.compileTemplate(messageTemplate, {
          firstName: recipient.firstName,
          lastName: recipient.lastName,
          ...recipient
        });

        // SMS gönder
        return this.sendSms(recipient.phone, personalizedMessage);
      });

      const results = await Promise.all(promises);

      return {
        success: true,
        recipientCount: recipients.length,
        results
      };
    } catch (error) {
      console.error('Kişiselleştirilmiş toplu SMS gönderme hatası:', error);
      throw new AppError(`Kişiselleştirilmiş toplu SMS gönderilemedi: ${error.message}`, 500);
    }
  }

  // Şablonu verilerle doldur
  compileTemplate(template, data) {
    return Object.keys(data).reduce((compiledTemplate, key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      return compiledTemplate.replace(regex, data[key]);
    }, template);
  }

  // Telefon numarasını formatla
  formatPhoneNumber(phone) {
    // Telefon numarasından tüm boşlukları, parantezleri ve tire işaretlerini çıkar
    let formattedPhone = phone.replace(/\s+|\(|\)|-/g, '');

    // Başında + veya 00 varsa kaldır
    if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('00')) {
      formattedPhone = formattedPhone.substring(2);
    }

    // Türkiye numarası için başında 0 varsa kaldır ve 90 ekle
    if (formattedPhone.startsWith('0') && formattedPhone.length === 11) {
      formattedPhone = '90' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('90') && formattedPhone.length === 10) {
      formattedPhone = '90' + formattedPhone;
    }

    return formattedPhone;
  }
}

module.exports = new SmsService();