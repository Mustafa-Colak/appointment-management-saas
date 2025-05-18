const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant"
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
    required: [true, "E-posta alanı gereklidir"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Geçerli bir e-posta adresi giriniz"]
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Şifre alanı gereklidir"],
    minlength: [6, "Şifre en az 6 karakter olmalıdır"],
    select: false // Sorgu sonuçlarında şifre dönmez
  },
  role: {
    type: String,
    enum: ["admin", "manager", "staff", "customer"],
    default: "staff"
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "active"
  },
  avatar: {
    type: String
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date
}, {
  timestamps: true
});

// Şifreyi hashleme
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// JWT token oluşturma
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, tenantId: this.tenantId, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );
};

// Tam adı döndüren sanal alan
userSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);