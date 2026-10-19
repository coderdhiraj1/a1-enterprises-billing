import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Seller from '@/models/Seller';
import { COMPANY_DEFAULTS } from '@/lib/companies';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const company = searchParams.get('company') || 'a1';

    if (company === 'all') {
      let a1 = await Seller.findOne({ id: { $in: ['a1', 'default_seller'] } });
      if (!a1) a1 = await Seller.create(COMPANY_DEFAULTS.a1);

      let shivMahima = await Seller.findOne({ id: 'shiv_mahima' });
      if (!shivMahima) shivMahima = await Seller.create(COMPANY_DEFAULTS.shiv_mahima);

      return NextResponse.json({ a1, shiv_mahima: shivMahima });
    }

    const targetCompany = company === 'shiv_mahima' ? 'shiv_mahima' : 'a1';
    let seller = await Seller.findOne({ 
      id: targetCompany === 'a1' ? { $in: ['a1', 'default_seller'] } : 'shiv_mahima' 
    });

    if (!seller) {
      seller = await Seller.create(COMPANY_DEFAULTS[targetCompany]);
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
    const targetCompany = data.companyId === 'shiv_mahima' || data.id === 'shiv_mahima' ? 'shiv_mahima' : 'a1';

    const seller = await Seller.findOneAndUpdate(
      { id: targetCompany === 'a1' ? { $in: ['a1', 'default_seller'] } : 'shiv_mahima' },
      { ...data, id: targetCompany },
      { new: true, upsert: true }
    );

    return NextResponse.json(seller);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
