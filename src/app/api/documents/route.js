import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Document from '@/models/Document';

const INITIAL_MOCK_DOCUMENTS = [
  {
    id: 'bill_1',
    type: 'bill',
    number: 'AE-2026-0001',
    date: '2026-06-15',
    customerName: 'Rajesh Patil',
    customerPhone: '+91-9844012345',
    customerAddress: 'Kaspate Wasti, Wakad, Pune',
    items: [
      { description: 'MS Safety Gate (Designer laser cut sheet)', qty: 45, unit: 'Sq.Ft', rate: 350, amount: 15750 },
      { description: 'Installation Charges', qty: 1, unit: 'Lumpsum', rate: 1500, amount: 1500 }
    ],
    subtotal: 17250,
    gstType: 'none',
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    discount: 500,
    total: 16750,
    notes: 'Thank you for your business with us!',
    paymentStatus: 'paid'
  },
  {
    id: 'quo_1',
    type: 'quotation',
    number: 'AQ-2026-0001',
    date: '2026-07-02',
    customerName: 'Skyline Builders & Developers',
    customerPhone: '+91-7722098765',
    customerAddress: 'Phase 3, Hinjewadi, Pune',
    items: [
      { description: 'SS Balcony Railing (304 Grade)', qty: 85, unit: 'Rft', rate: 650, amount: 55250 },
      { description: 'Laser Cutting CNC Main Gate', qty: 120, unit: 'Sq.Ft', rate: 420, amount: 50400 },
      { description: 'Transport Charges', qty: 1, unit: 'Lumpsum', rate: 2500, amount: 2500 }
    ],
    subtotal: 108150,
    gstType: 'exclusive',
    gstRate: 18,
    cgst: 9733.5,
    sgst: 9733.5,
    discount: 5000,
    total: 122617,
    notes: 'Validity: This quotation is valid for 30 days. Payment terms: 50% advance, balance on delivery.',
    paymentStatus: 'quote'
  }
];

export async function GET(req) {
  try {
    await dbConnect();
    
    // Seed initial data if DB is empty
    let count = await Document.countDocuments({});
    if (count === 0) {
      await Document.insertMany(INITIAL_MOCK_DOCUMENTS);
    }
    
    const { searchParams } = new URL(req.url);
    const paginate = searchParams.get('paginate') === 'true';
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const query = {};
    
    if (type !== 'all') {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { number: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (paginate) {
      const skip = (page - 1) * limit;
      const docs = await Document.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
      const totalDocs = await Document.countDocuments(query);
      const totalPages = Math.ceil(totalDocs / limit);
      
      return NextResponse.json({
        documents: docs,
        pagination: {
          totalDocs,
          totalPages,
          page,
          limit
        }
      });
    } else {
      const docs = await Document.find(query).sort({ date: -1, createdAt: -1 });
      return NextResponse.json(docs);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json({ error: 'Document id is required' }, { status: 400 });
    }
    
    const doc = await Document.findOneAndUpdate(
      { id: data.id },
      data,
      { new: true, upsert: true }
    );
    
    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 550 });
  }
}
