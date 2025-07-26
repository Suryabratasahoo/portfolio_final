import Experience from '@/models/experience';
import connectDB from '@/lib/connectDb';
import { NextResponse,NextRequest } from 'next/server';

// GET all experiences
export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find({}).sort({ order: 1 });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// POST to create a new experience
export async function POST(request:NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newExperience = new Experience(body);
    await newExperience.save();
    
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 400 }
    );
  }
}