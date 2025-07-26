import connectDB from '@/lib/connectDb'
import Skill from '@/models/Skill'
import Category from '@/models/Category'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function POST(request:Request) {
  try {
    await connectDB()

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

    const skill = await Skill.create({
      name,
      icon,
      level,
      categoryId,
    })

    return NextResponse.json({
      ...skill.toObject(),
      id: skill._id.toString(),
      categoryId: skill.categoryId.toString(),
    }, { status: 201 })
  } catch (error:any) {
    console.error('Error creating skill:', error)
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}
