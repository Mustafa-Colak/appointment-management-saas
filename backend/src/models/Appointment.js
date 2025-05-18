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
  confirmationSent: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: Date
  },
  cancelledReason: {
    type: String
  },
  cancelledBy: {
    type: String,
    enum: ["customer", "staff", "system"]
  },
  source: {
    type: String,
    enum: ["website", "app", "phone", "walk-in", "other"],
    default: "website"
  },
  payment: {
    status: {
      type: String,
      enum: ["pending", "paid", "partial", "refunded", "cancelled"],
      default: "pending"
    },
    amount: {
      type: Number,
      default: 0
    },
    method: {
      type: String,
      enum: ["cash", "credit_card", "debit_card", "online", "other"]
    },
    transactionId: String
  }
}, {
  timestamps: true
});

// Randevu süresi kontrolü
appointmentSchema.pre("save", async function(next) {
  if (this.startTime >= this.endTime) {
    throw new Error("Randevu başlangıç zamanı, bitiş zamanından önce olmalıdır");
  }
  next();
});

// Popülasyon işlemi
appointmentSchema.pre(/^find/, function(next) {
  this.populate({
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
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);