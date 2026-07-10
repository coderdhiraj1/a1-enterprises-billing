import mongoose from 'mongoose';

const SellerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: 'default_seller' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  bankName: { type: String, required: true },
  accountName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.models.Seller || mongoose.model('Seller', SellerSchema);
