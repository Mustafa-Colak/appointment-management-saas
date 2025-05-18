# create-backend-files.ps1
# Backend dosyalarını oluşturur

param (
    [string]$rootFolder
)

# Backend dosyaları
$backendFiles = @(
    # Temel dosyalar
    "backend\package.json",
    "backend\nodemon.json",
    "backend\.env.example",
    "backend\.eslintrc.js",
    "backend\src\app.js",
    "backend\src\server.js",
    
    # API dosyaları
    "backend\src\api\index.js",
    "backend\src\api\v1\auth.js",
    "backend\src\api\v1\tenants.js",
    "backend\src\api\v1\users.js",
    "backend\src\api\v1\appointments.js",
    "backend\src\api\v1\customers.js",
    "backend\src\api\v1\services.js",
    "backend\src\api\v1\staff.js",
    "backend\src\api\v1\payments.js",
    "backend\src\api\v1\products.js",
    "backend\src\api\v1\reports.js",
    
    # Config dosyaları
    "backend\src\config\database.js",
    "backend\src\config\auth.js",
    "backend\src\config\app.js",
    "backend\src\config\environment.js",
    
    # Controller dosyaları
    "backend\src\controllers\authController.js",
    "backend\src\controllers\tenantController.js",
    "backend\src\controllers\userController.js",
    "backend\src\controllers\appointmentController.js",
    "backend\src\controllers\customerController.js",
    "backend\src\controllers\serviceController.js",
    "backend\src\controllers\staffController.js",
    "backend\src\controllers\paymentController.js",
    "backend\src\controllers\productController.js",
    "backend\src\controllers\reportController.js",
    
    # Middleware dosyaları
    "backend\src\middlewares\auth.js",
    "backend\src\middlewares\tenantAccess.js",
    "backend\src\middlewares\error.js",
    "backend\src\middlewares\validation.js",
    "backend\src\middlewares\logger.js",
    
    # Model dosyaları
    "backend\src\models\Tenant.js",
    "backend\src\models\User.js",
    "backend\src\models\Customer.js",
    "backend\src\models\Service.js",
    "backend\src\models\Staff.js",
    "backend\src\models\Appointment.js",
    "backend\src\models\Payment.js",
    "backend\src\models\Product.js",
    "backend\src\models\CustomerHistory.js",
    
    # Service dosyaları
    "backend\src\services\authService.js",
    "backend\src\services\tenantService.js",
    "backend\src\services\userService.js",
    "backend\src\services\appointmentService.js",
    "backend\src\services\customerService.js",
    "backend\src\services\serviceService.js",
    "backend\src\services\staffService.js",
    "backend\src\services\paymentService.js",
    "backend\src\services\productService.js",
    "backend\src\services\notificationService.js",
    "backend\src\services\emailService.js",
    "backend\src\services\smsService.js",
    "backend\src\services\reportService.js",
    
    # Utils dosyaları
    "backend\src\utils\db.js",
    "backend\src\utils\validation.js",
    "backend\src\utils\helpers.js",
    "backend\src\utils\date.js",
    "backend\src\utils\security.js",
    
    # Jobs dosyaları
    "backend\src\jobs\reminderJob.js",
    "backend\src\jobs\reportJob.js",
    "backend\src\jobs\scheduler.js",
    
    # Validator dosyaları
    "backend\src\validators\auth.js",
    "backend\src\validators\tenant.js",
    "backend\src\validators\user.js",
    "backend\src\validators\appointment.js",
    "backend\src\validators\customer.js",
    "backend\src\validators\service.js",
    "backend\src\validators\payment.js",
    
    # Error dosyaları
    "backend\src\errors\AppError.js",
    "backend\src\errors\errorHandler.js",
    "backend\src\errors\errorTypes.js",
    
    # Migration dosyaları
    "backend\database\migrations\001_create_tenants.js",
    "backend\database\migrations\002_create_users.js",
    "backend\database\migrations\003_create_customers.js",
    "backend\database\migrations\004_create_services.js",
    "backend\database\migrations\005_create_staff.js",
    "backend\database\migrations\006_create_appointments.js",
    "backend\database\migrations\007_create_payments.js",
    "backend\database\migrations\008_create_products.js",
    "backend\database\migrations\009_create_customer_history.js",
    
    # Seed dosyaları
    "backend\database\seeds\seed_tenants.js",
    "backend\database\seeds\seed_users.js",
    "backend\database\seeds\seed_customers.js",
    "backend\database\seeds\seed_services.js",
    "backend\database\seeds\seed_staff.js",
    "backend\database\seeds\seed_appointments.js"
)

# Tüm backend dosyalarını oluştur
foreach ($file in $backendFiles) {
    $filePath = "$rootFolder\$file"
    New-Item -Path $filePath -ItemType File -Force | Out-Null
    # Her bir dosya için bir varsayılan içerik ekle
    if ($file -match "\.js$") {
        Set-Content -Path $filePath -Value "// $file dosyası"
    } elseif ($file -match "\.json$") {
        Set-Content -Path $filePath -Value '{}'
    }
    Write-Host "Dosya oluşturuldu: $filePath" -ForegroundColor Cyan
}

# Backend için package.json dosyasını güncelle
Set-Content -Path "$rootFolder\backend\package.json" -Value '{
  "name": "appointment-management-saas-backend",
  "version": "0.1.0",
  "private": true,
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "helmet": "^6.1.5",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.1.1",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.1",
    "winston": "^3.8.2"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "nodemon": "^2.0.22",
    "supertest": "^6.3.3"
  }
}'

# Temel model ve controller dosyalarına içerik ekle
Set-Content -Path "$rootFolder\backend\src\models\Tenant.js" -Value '// Tenant model
const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    unique: true,
    trim: true
  },
  businessType: {
    type: String,
    enum: ["berber", "kuafor", "dishekimi", "petKlinik", "sacEkim", "guzellik", "spa", "diger"],
    required: true
  },
  subscriptionPlan: {
    type: String,
    enum: ["temel", "profesyonel", "isletme"],
    default: "temel"
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended", "trial"],
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// Her kayıt güncellendiğinde updatedAt alanını güncelle
tenantSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Tenant", tenantSchema);'

Set-Content -Path "$rootFolder\backend\src\models\Appointment.js" -Value '// Appointment model
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["scheduled", "confirmed", "completed", "cancelled", "no-show"],
    default: "scheduled"
  },
  notes: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// Her kayıt güncellendiğinde updatedAt alanını güncelle
appointmentSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

// Randevu süresi kontrolü
appointmentSchema.pre("save", async function(next) {
  if (this.startTime >= this.endTime) {
    throw new Error("Randevu başlangıç zamanı, bitiş zamanından önce olmalıdır");
  }
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);'

Set-Content -Path "$rootFolder\backend\src\controllers\appointmentController.js" -Value '// Appointment controller
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
'

Set-Content -Path "$rootFolder\backend\src\app.js" -Value '// Backend ana uygulama
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error");
const apiRoutes = require("./api");

// Environment variables
require("dotenv").config();

// MongoDB bağlantısı
require("./config/database");

// Express uygulaması oluştur
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/v1", apiRoutes);

// Ana route
app.get("/", (req, res) => {
  res.json({
    message: "Randevu Yönetim Sistemi API",
    status: "active",
    timestamp: new Date()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route bulunamadı" });
});

// Hata yönetimi
app.use(errorHandler);

module.exports = app;'

Set-Content -Path "$rootFolder\backend\src\server.js" -Value '// Backend server
const app = require("./app");

// Environment variables
const PORT = process.env.PORT || 8000;

// Server başlat
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});'