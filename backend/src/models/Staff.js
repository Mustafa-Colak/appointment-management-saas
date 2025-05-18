const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  bio: {
    type: String
  },
  specialties: [String],
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  }],
  workingHours: {
    monday: { 
      isWorking: { type: Boolean, default: true },
      shifts: [{ 
        start: String, 
        end: String 
      }]
    },
    tuesday: { 
      isWorking: { type: Boolean, default: true },
      shifts: [{ 
        start: String, 
        end: String 
      }]
    },
    wednesday: { 
      isWorking: { type: Boolean, default: true },
      shifts: [{ 
        start: String, 
        end: String 
      }]
    },
    thursday: { 
      isWorking: { type: Boolean, default: true },
      shifts: [{ 
        start: String, 
        end: String 
      }]
    },
    friday: { 
      isWorking: { type: Boolean, default: true },
      shifts: [{ 
        start: String, 
        end: String 
      }]
    },
    saturday: { 
      isWorking: { type: Boolean, default: true },
      shifts: [{ 
        start: String, 
        end: String 
      }]
    },
    sunday: { 
      isWorking: { type: Boolean, default: false },
      shifts: [{ 
        start: String, 
        end: String 
      }]
    }
  },
  vacationDays: [{
    startDate: Date,
    endDate: Date,
    reason: String
  }],
  commissionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0 // Yüzde cinsinden
  },
  image: {
    type: String
  },
  color: {
    type: String,
    default: "#3498db" // Varsayılan renk
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// User bilgilerini getiren virtual field
staffSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model("Staff", staffSchema);