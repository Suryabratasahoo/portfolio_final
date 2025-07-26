import { NextResponse,NextRequest } from 'next/server';
import connectDB from '@/lib/connectDb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request:NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    const project = await Project.create(data);
    
    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}