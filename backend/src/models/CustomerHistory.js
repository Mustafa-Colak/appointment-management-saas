const mongoose = require("mongoose");

const customerHistorySchema = new mongoose.Schema({
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
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff"
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment"
  },
  type: {
    type: String,
    enum: ["service", "note", "payment", "membership", "other"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  notes: {
    type: String
  },
  images: [String],
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Popülasyon işlemi
customerHistorySchema.pre(/^find/, function(next) {
  this.populate({
    path: "staffId",
    select: "userId",
    populate: {
      path: "userId",
      select: "firstName lastName"
    }
  })
  .populate({
    path: "serviceId",
    select: "name"
  });
  next();
});

module.exports = mongoose.model("CustomerHistory", customerHistorySchema);