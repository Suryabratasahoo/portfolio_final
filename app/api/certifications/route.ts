

import connectDB from '@/lib/connectDb';
import mongoose from 'mongoose';
import Certification from '@/models/certification';
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch all certifications
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const certifications = await Certification.find().lean();
    
    return NextResponse.json({ certifications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certifications data' },
      { status: 500 }
    );
  }
}

// POST: Add new certifications
export async function POST(request: NextRequest) {
  try {
    const { newCertifications } = await request.json();
    
    if (!newCertifications || !Array.isArray(newCertifications) || newCertifications.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: newCertifications array is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Insert the new certification documents
    const result = await Certification.insertMany(newCertifications);
    
    return NextResponse.json(
      { success: true, certifications: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding certifications:', error);
    return NextResponse.json(
      { error: 'Failed to add certification data' },
      { status: 500 }
    );
  }
}

// PUT: Update and/or delete certifications
export async function PUT(request: NextRequest) {
  try {
    const { updatedCertifications, deletedIds } = await request.json();
    
    if ((!updatedCertifications || !Array.isArray(updatedCertifications)) && 
        (!deletedIds || !Array.isArray(deletedIds))) {
      return NextResponse.json(
        { error: 'Invalid request: updatedCertifications or deletedIds array is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Handle certification updates
    if (updatedCertifications && updatedCertifications.length > 0) {
      // Process each certification update as a separate operation
    interface UpdatedCertification {
      _id: string;
      [key: string]: any;
    }

    const updateOperations = updatedCertifications.map((cert: UpdatedCertification) => {
      const { _id, ...updateData } = cert;
      return Certification.updateOne(
        { _id: new mongoose.Types.ObjectId(_id) },
        { $set: updateData }
      );
    });
      
      await Promise.all(updateOperations);
    }
    
    // Handle certification deletions
    if (deletedIds && deletedIds.length > 0) {
      // Convert string IDs to ObjectId
    const objectIds: mongoose.Types.ObjectId[] = deletedIds.map((id: string) => new mongoose.Types.ObjectId(id));
      
      await Certification.deleteMany({
        _id: { $in: objectIds }
      });
    }
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating certifications:', error);
    return NextResponse.json(
      { error: 'Failed to update certification data' },
      { status: 500 }
    );
  }
}