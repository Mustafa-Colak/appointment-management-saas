const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "İşletme adı gereklidir"],
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
    required: [true, "İşletme türü seçilmelidir"]
  },
  subscriptionPlan: {
    type: String,
    enum: ["temel", "profesyonel", "isletme"],
    default: "temel"
  },
  customSettings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended", "trial"],
    default: "active"
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  workingHours: {
    monday: { start: String, end: String, isOpen: Boolean },
    tuesday: { start: String, end: String, isOpen: Boolean },
    wednesday: { start: String, end: String, isOpen: Boolean },
    thursday: { start: String, end: String, isOpen: Boolean },
    friday: { start: String, end: String, isOpen: Boolean },
    saturday: { start: String, end: String, isOpen: Boolean },
    sunday: { start: String, end: String, isOpen: Boolean }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Her kayıt güncellendiğinde updatedAt alanını güncelle
tenantSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Tenant", tenantSchema);