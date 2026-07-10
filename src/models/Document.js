import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  qty: { type: Number, required: true },
  unit: { type: String, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const DocumentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['bill', 'quotation'], required: true },
  number: { type: String, required: true },
  date: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  customerAddress: { type: String, default: '' },
  items: [ItemSchema],
  subtotal: { type: Number, required: true },
  gstType: { type: String, enum: ['none', 'exclusive', 'inclusive'], default: 'none' },
  gstRate: { type: Number, default: 18 },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  notes: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['paid', 'unpaid', 'quote'], default: 'unpaid' },
  validUntil: { type: String }
}, {
  timestamps: true
});

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);
