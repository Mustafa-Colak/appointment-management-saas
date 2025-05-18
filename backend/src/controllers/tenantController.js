const Tenant = require("../models/Tenant");
const User = require("../models/User");
const { AppError } = require("../errors/AppError");

// Tüm kiracıları getir (Sadece admin)
exports.getTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.find();
    
    res.status(200).json({
      success: true,
      count: tenants.length,
      data: tenants
    });
  } catch (error) {
    next(error);
  }
};

// Tek bir kiracıyı getir
exports.getTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    
    if (!tenant) {
      return next(new AppError("İşletme bulunamadı", 404));
    }
    
    // Kiracı erişim kontrolü
    if (req.user.role !== "admin" && tenant._id.toString() !== req.user.tenantId.toString()) {
      return next(new AppError("Bu işletmeye erişim izniniz yok", 403));
    }
    
    res.status(200).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    next(error);
  }
};

// Yeni kiracı oluştur
exports.createTenant = async (req, res, next) => {
  try {
    const { name, businessType, domain, contactInfo, workingHours } = req.body;
    
    // İşletme adı ve türü kontrolü
    if (!name || !businessType) {
      return next(new AppError("İşletme adı ve türü gereklidir", 400));
    }
    
    // Domain benzersizliği kontrolü
    if (domain) {
      const existingTenant = await Tenant.findOne({ domain });
      if (existingTenant) {
        return next(new AppError("Bu domain zaten kullanılıyor", 400));
      }
    }
    
    // Yeni işletme oluştur
    const tenant = await Tenant.create({
      name,
      businessType,
      domain,
      contactInfo,
      workingHours,
      status: "active"
    });
    
    res.status(201).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    next(error);
  }
};

// Kiracı güncelleme
exports.updateTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // İşletmeyi bul
    let tenant = await Tenant.findById(id);
    
    if (!tenant) {
      return next(new AppError("İşletme bulunamadı", 404));
    }
    
    // Kiracı erişim kontrolü
    if (req.user.role !== "admin" && tenant._id.toString() !== req.user.tenantId.toString()) {
      return next(new AppError("Bu işletmeyi güncelleme izniniz yok", 403));
    }
    
    // Domain güncelleniyorsa benzersizlik kontrolü
    if (req.body.domain && req.body.domain !== tenant.domain) {
      const existingTenant = await Tenant.findOne({ domain: req.body.domain });
      if (existingTenant) {
        return next(new AppError("Bu domain zaten kullanılıyor", 400));
      }
    }
    
    // İşletmeyi güncelle
    tenant = await Tenant.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    next(error);
  }
};

// Kiracı silme (deaktif etme)
exports.deleteTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // İşletmeyi bul
    const tenant = await Tenant.findById(id);
    
    if (!tenant) {
      return next(new AppError("İşletme bulunamadı", 404));
    }
    
    // Sadece admin silebilir
    if (req.user.role !== "admin") {
      return next(new AppError("Bu işletmeyi silme izniniz yok", 403));
    }
    
    // İşletmeyi deaktif et
    tenant.status = "inactive";
    await tenant.save();
    
    res.status(200).json({
      success: true,
      message: "İşletme başarıyla deaktif edildi"
    });
  } catch (error) {
    next(error);
  }
};

// İşletme durumunu değiştir
exports.changeTenantStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !["active", "inactive", "suspended", "trial"].includes(status)) {
      return next(new AppError("Geçerli bir durum belirtmelisiniz", 400));
    }
    
    // İşletmeyi bul
    const tenant = await Tenant.findById(id);
    
    if (!tenant) {
      return next(new AppError("İşletme bulunamadı", 404));
    }
    
    // Sadece admin durum değiştirebilir
    if (req.user.role !== "admin") {
      return next(new AppError("İşletme durumunu değiştirme izniniz yok", 403));
    }
    
    // İşletme durumunu güncelle
    tenant.status = status;
    await tenant.save();
    
    res.status(200).json({
      success: true,
      message: `İşletme durumu başarıyla '${status}' olarak değiştirildi`,
      data: tenant
    });
  } catch (error) {
    next(error);
  }
};

// İşletme istatistiklerini getir
exports.getTenantStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // İşletmeyi bul
    const tenant = await Tenant.findById(id);
    
    if (!tenant) {
      return next(new AppError("İşletme bulunamadı", 404));
    }
    
    // Kiracı erişim kontrolü
    if (req.user.role !== "admin" && tenant._id.toString() !== req.user.tenantId.toString()) {
      return next(new AppError("Bu işletme istatistiklerine erişim izniniz yok", 403));
    }
    
    // TODO: İşletme istatistiklerini hesapla
    // Burada işletme istatistiklerini hesaplamak için ilgili servisleri çağırabiliriz
    
    res.status(200).json({
      success: true,
      data: {
        // Örnek istatistikler
        totalUsers: await User.countDocuments({ tenantId: id }),
        // TODO: Diğer istatistikler
      }
    });
  } catch (error) {
    next(error);
  }
};