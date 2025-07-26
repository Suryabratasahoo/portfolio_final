import connectDB from '@/lib/connectDb';
import NowItem from "@/models/NowItem"
import { NextResponse,NextRequest } from 'next/server';

/**
 * GET handler - Fetch all Now items
 */
export async function GET() {
  try {
    await connectDB();
    
    // Fetch all items sorted by order
    const items = await NowItem.find({}).sort({ order: 1 });
    
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Error fetching Now items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Now items' },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create or update multiple Now items
 */
export async function POST(request:NextRequest) {
  try {
    const data = await request.json();
    await connectDB();
    
    // Delete all existing items first
    await NowItem.deleteMany({});
    
    // Create all items with order
    interface NowItemInput {
        id?: string;
        [key: string]: any;
    }

    const items = await Promise.all(
        (data as NowItemInput[]).map(async (item: NowItemInput, index: number) => {
            // Remove the client-side ID if present
            if (item.id) delete item.id;
            
            // Add order based on index
            const newItem = new NowItem({
                ...item,
                order: index
            });
            
            return newItem.save();
        })
    );
    
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Error updating Now items:', error);
    return NextResponse.json(
      { error: 'Failed to update Now items' },
      { status: 500 }
    );
  }
}