import { NextRequest, NextResponse } from 'next/server';
import { runMiddleware, uploadSingle, UploadedFile } from '@/lib/multer';
import connectDB from '@/lib/connectDb';
import fs from 'fs';
import path from 'path';
import Skill from '@/models/Skill';



// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'skills');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    // Convert NextRequest to Node.js compatible request object
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const skillId = formData.get('skillId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!skillId) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Check if skill exists
    const skill=await Skill.findById(skillId);

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.name);
    const filename = `skill-icon-${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write file to disk
    fs.writeFileSync(filepath, buffer);

    // Generate URL for the uploaded file
    const iconUrl = `/uploads/skills/${filename}`;

    // Delete old icon file if it exists and is not a placeholder
    if (skill.icon && 
        skill.icon.startsWith('/uploads/skills/') && 
        skill.icon !== '/placeholder.svg') {
      const oldFilePath = path.join(process.cwd(), 'public', skill.icon);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update skill with new icon URL
    const updatedSkill=await Skill.findByIdAndUpdate(
        skillId,
        { icon: iconUrl },
        { new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      iconUrl: iconUrl,
      skill: updatedSkill
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Only image files are allowed')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }
      if (error.message.includes('File too large')) {
        return NextResponse.json(
          { error: 'File size must be less than 5MB' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  } 
}

