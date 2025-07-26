import Experience from '@/models/experience';
import connectDB from '@/lib/connectDb';
import { NextResponse,NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = context.params;

    const experience = await Experience.findById(id);

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}


export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = context.params;
    const body = await request.json();

    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedExperience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json(updatedExperience);
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 400 });
  }
}


export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = context.params;

    const deletedExperience = await Experience.findByIdAndDelete(id);

    if (!deletedExperience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json(deletedExperience);
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
