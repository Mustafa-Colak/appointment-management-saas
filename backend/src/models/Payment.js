const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment"
  },
  amount: {
    type: Number,
    required: [true, "Ödeme tutarı gereklidir"],
    min: [0, "Ödeme tutarı negatif olamaz"]
  },
  method: {
    type: String,
    enum: ["cash", "credit_card", "debit_card", "online", "other"],
    required: [true, "Ödeme yöntemi gereklidir"]
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  currency: {
    type: String,
    default: "TRY"
  },
  note: {
    type: String
  },
  transactionId: {
    type: String
  },
  refundReason: {
    type: String
  },
  refundedAmount: {
    type: Number,
    default: 0
  },
  refundedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [{
    type: {
      type: String,
      enum: ["service", "product"],
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Tüm ürün ve hizmetlerin toplam tutarını hesaplama
paymentSchema.pre("save", function(next) {
  if (this.items && this.items.length > 0) {
    const totalAmount = this.items.reduce((sum, item) => {
      return sum + ((item.price * item.quantity) - item.discount);
    }, 0);
    this.amount = totalAmount;
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);