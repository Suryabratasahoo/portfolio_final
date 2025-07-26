import connectDB from '@/lib/connectDb'
import Category from '@/models/Category'
import { NextResponse } from 'next/server'

export async function POST(request:Request) {
  try {
    await connectDB()

    const { name, color } = await request.json()

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Name and color are required' },
        { status: 400 }
      )
    }

    const category = await Category.create({
      name,
      color,
    })

    return NextResponse.json({
      ...category.toObject(),
      id: category._id.toString(),
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    if (error instanceof Error && (error as any).name === 'ValidationError') {
      return NextResponse.json(
        { error: (error as any).message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}