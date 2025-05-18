const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },
  name: {
    type: String,
    required: [true, "Ürün adı gereklidir"],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Ürün fiyatı gereklidir"],
    min: [0, "Ürün fiyatı negatif olamaz"]
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  barcode: {
    type: String
  },
  brand: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  sku: {
    type: String
  },
  purchasePrice: {
    type: Number
  },
  supplier: {
    name: String,
    contactPerson: String,
    phone: String,
    email: String
  }
}, {
  timestamps: true
});

// Düşük stok kontrolü
productSchema.virtual("isLowStock").get(function() {
  return this.stockQuantity <= this.lowStockThreshold;
});

module.exports = mongoose.model("Product", productSchema);