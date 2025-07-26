import connectDB from '@/lib/connectDb'
import Skill from '@/models/Skill'
import Category from '@/models/Category'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function PUT(request:Request, { params }:{params:{id:string}}) {
  try {
    await connectDB()

    const { id } = await params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid skill ID' },
        { status: 400 }
      )
    }

    const { name, icon, level, categoryId } = await request.json()

    if (!name || !icon || level === undefined || !categoryId) {
      return NextResponse.json(
        { error: 'Name, icon, level, and categoryId are required' },
        { status: 400 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }

    // Check if category exists
    const categoryExists = await Category.findById(categoryId)
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const skill = await Skill.findByIdAndUpdate(
      id,
      { name, icon, level, categoryId },
      { new: true, runValidators: true }
    )

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...skill.toObject(),
      id: skill._id.toString(),
      categoryId: skill.categoryId.toString(),
    })
  } catch (error:any) {
    console.error('Error updating skill:', error)
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    )
  }
}

export async function DELETE(request:Request, { params }:{params:{id:string}}) {
  try {
    await connectDB()

    const { id } = await params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid skill ID' },
        { status: 400 }
      )
    }

    const skill = await Skill.findByIdAndDelete(id)

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Skill deleted successfully' })
  } catch (error:any) {
    console.error('Error deleting skill:', error)
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    )
  }
}