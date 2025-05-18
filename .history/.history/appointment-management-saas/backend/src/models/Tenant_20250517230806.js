// Tenant model
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

module.exports = mongoose.model("Tenant", tenantSchema);
