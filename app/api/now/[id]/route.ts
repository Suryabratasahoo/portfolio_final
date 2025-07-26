import connectDB from '@/lib/connectDb';
import NowItem from '@/models/NowItem';
import { NextResponse,NextRequest } from 'next/server';

/**
 * GET handler - Fetch a specific Now item by ID
 */
export async function GET(request: NextRequest,
  context: { params: { id: string } }) {
  try {
    await connectDB();
    
    const id = context.params.id;
    
    // Find the item by ID
    const item = await NowItem.findById(id);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error(`Error fetching Now item ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch Now item' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Update a specific Now item
 */
export async function PUT(request:NextRequest, context: { params: { id: string } }) {
  try {
    const data = await request.json();
    await connectDB();
    
    const id = context.params.id;
    
    // Find and update the item
    const updatedItem = await NowItem.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error(`Error updating Now item ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update Now item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Delete a specific Now item
 */
export async function DELETE(request:NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    
    const id = context.params.id;
    
    // Find and delete the item
    const deletedItem = await NowItem.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting Now item ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete Now item' },
      { status: 500 }
    );
  }
}