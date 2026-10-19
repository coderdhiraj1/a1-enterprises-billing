import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Document from '@/models/Document';

function getDocQuery(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ id: id }, { _id: id }] };
  }
  return { id: id };
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Await params in Next.js 15+
    
    const doc = await Document.findOne(getDocQuery(id));
    
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Await route params in Next.js 15+
    const data = await req.json();
    
    const doc = await Document.findOneAndUpdate(
      getDocQuery(id),
      data,
      { new: true }
    );
    
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Await route params in Next.js 15+
    
    const result = await Document.findOneAndDelete(getDocQuery(id));
    
    if (!result) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

