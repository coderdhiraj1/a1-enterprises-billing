import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Seller from '@/models/Seller';

const DEFAULT_SELLER = {
  id: 'default_seller',
  name: 'A-1 Enterprises Fabrication Works',
  phone: '+91-7759971969',
  email: 'enterprises.a1@gmail.com',
  address: 'Shani Mandir Road, Shivar Basti, Marunji, Pune, Maharashtra 411057',
  bankName: 'ICICI BANK',
  accountName: 'Rakesh Sharma',
  accountNumber: '329701501647',
  ifscCode: 'ICICI0003297'
};

export async function GET() {
  try {
    await dbConnect();
    let seller = await Seller.findOne({ id: 'default_seller' });
    
    if (!seller) {
      // Seed default seller info
      seller = await Seller.create(DEFAULT_SELLER);
    }
    
    return NextResponse.json(seller);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Force Default ID for company settings configuration
    const seller = await Seller.findOneAndUpdate(
      { id: 'default_seller' },
      { ...data, id: 'default_seller' },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(seller);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
