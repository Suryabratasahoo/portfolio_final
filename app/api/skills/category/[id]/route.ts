import connectDB from '@/lib/connectDb'
import Category from '@/models/Category'
import Skill from '@/models/Skill'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = await params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }

    const { name, color } = await request.json()

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Name and color are required' },
        { status: 400 }
      )
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, color },
      { new: true, runValidators: true }
    )

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...category.toObject(),
      id: category._id.toString(),
    })
  } catch (error:any) {
    console.error('Error updating category:', error)
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request:Request, { params }:{ params: { id: string } }) {
  try {
    await connectDB()

    const { id } =await params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }

    // First, delete all skills in this category
    await Skill.deleteMany({ categoryId: id })

    // Then delete the category
    const category = await Category.findByIdAndDelete(id)

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Category and associated skills deleted successfully' })
  } catch (error:any) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
