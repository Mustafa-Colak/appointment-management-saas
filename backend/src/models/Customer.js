const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  firstName: {
    type: String,
    required: [true, "Ad alanı gereklidir"],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, "Soyad alanı gereklidir"],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Geçerli bir e-posta adresi giriniz"]
  },
  phone: {
    type: String,
    required: [true, "Telefon alanı gereklidir"],
    trim: true
  },
  birthDate: {
    type: Date
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "unspecified"],
    default: "unspecified"
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  notes: {
    type: String
  },
  tags: [String],
  source: {
    type: String,
    enum: ["website", "app", "phone", "walk-in", "referral", "other"],
    default: "other"
  },
  membershipStatus: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "active"
  },
  marketingConsent: {
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    }
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Tam adı döndüren sanal alan
customerSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Customer", customerSchema);