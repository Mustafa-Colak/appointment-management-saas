// Appointment model
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

module.exports = mongoose.model("Appointment", appointmentSchema);
