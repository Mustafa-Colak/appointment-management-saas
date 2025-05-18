const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },
  name: {
    type: String,
    required: [true, "Hizmet adı gereklidir"],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // Dakika cinsinden
    required: [true, "Hizmet süresi gereklidir"],
    min: [5, "Hizmet süresi en az 5 dakika olmalıdır"]
  },
  price: {
    type: Number,
    required: [true, "Hizmet fiyatı gereklidir"],
    min: [0, "Hizmet fiyatı negatif olamaz"]
  },
  category: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  color: {
    type: String,
    default: "#3498db" // Varsayılan renk
  },
  isActive: {
    type: Boolean,
    default: true
  },
  staffMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Service", serviceSchema);