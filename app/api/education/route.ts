// api/education/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDb';
import Education from '@/models/Education';

// GET handler to retrieve all education data
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const education = await Education.find({}).sort({ period: -1 });
    return NextResponse.json({ education }, { status: 200 });
  } catch (error) {
    console.error('Error fetching education data:', error);
    return NextResponse.json(
      { message: 'Error fetching education data' },
      { status: 500 }
    );
  }
}

// POST handler to add new education items
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { newEducation } = await request.json();
    
    if (!Array.isArray(newEducation) || newEducation.length === 0) {
      return NextResponse.json(
        { message: 'No valid education data provided' },
        { status: 400 }
      );
    }
    
    // Create all new education items
    const createdEducation = await Education.create(newEducation);
    
    return NextResponse.json(
      { 
        message: 'Education data added successfully',
        education: Array.isArray(createdEducation) ? createdEducation : [createdEducation]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding education data:', error);
    return NextResponse.json(
      { message: 'Error adding education data' },
      { status: 500 }
    );
  }
}

// PUT handler to update existing education items and/or delete items
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { updatedEducation, deletedIds } = await request.json();
    
    const operations = [];
    
    // Handle updates
    if (Array.isArray(updatedEducation) && updatedEducation.length > 0) {
      const updateOperations = updatedEducation.map((item) => {
        const { _id, ...updateData } = item;
        return Education.findByIdAndUpdate(_id, updateData, { new: true });
      });
      operations.push(...updateOperations);
    }
    
    // Handle deletions
    if (Array.isArray(deletedIds) && deletedIds.length > 0) {
      const deleteOperation = Education.deleteMany({ _id: { $in: deletedIds } });
      operations.push(deleteOperation);
    }
    
    // Execute all operations
    if (operations.length > 0) {
      await Promise.all(operations);
    }
    
    // Return updated education list
    const updatedEducationList = await Education.find({}).sort({ period: -1 });
    
    return NextResponse.json(
      { 
        message: 'Education data updated successfully',
        education: updatedEducationList
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating education data:', error);
    return NextResponse.json(
      { message: 'Error updating education data' },
      { status: 500 }
    );
  }
}