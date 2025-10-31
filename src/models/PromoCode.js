import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  promoCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  maxUsage: {
    type: Number,
    default: 1
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better performance
promoCodeSchema.index({ promoCode: 1 });
promoCodeSchema.index({ agentId: 1 });
promoCodeSchema.index({ validUntil: 1 });
promoCodeSchema.index({ isActive: 1 });

export default mongoose.models.PromoCode || mongoose.model('PromoCode', promoCodeSchema);