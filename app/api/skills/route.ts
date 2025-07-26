import connectDB from '@/lib/connectDb'
import Category from '@/models/Category'
import Skill from '@/models/Skill'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()

    // Get all categories
    const categories = await Category.find({}).sort({ createdAt: 1 }).lean()

    // Get all skills and group them by categoryId
    const skills = await Skill.find({}).sort({ createdAt: 1 }).lean()

    // Add skills to their respective categories
    const categoriesWithSkills = categories.map((category: any) => ({
      ...category,
      id: category._id.toString(),
      skills: skills
        .filter(skill => skill.categoryId.toString() === category._id.toString())
        .map((skill:any) => ({
          ...skill,
          id: skill._id.toString(),
          categoryId: skill.categoryId.toString(),
        }))
    }))

    return NextResponse.json(categoriesWithSkills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}