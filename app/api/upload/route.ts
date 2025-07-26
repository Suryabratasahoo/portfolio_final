import { NextResponse,NextRequest } from 'next/server';
import connectDB from '@/lib/connectDb';
import Project from '@/models/Project';
import cloudinary from '@/lib/cloudinary';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request:NextRequest) {
  try {
    await connectDB();
    
    // Since Next.js App Router doesn't support FormData directly with middleware like Multer
    // We need to handle file uploads differently
    const formData = await request.formData();
    const projectId = formData.get('projectId');
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded or invalid file type' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file to temp directory
    const filePath = join('/tmp', file.name);
    await writeFile(filePath, buffer);
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'portfolio-projects',
      resource_type: 'image'
    });
    
    // Update project with new image URL
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        image: result.secure_url,
        cloudinaryId: result.public_id
      },
      { new: true }
    );
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        image: result.secure_url,
        cloudinaryId: result.public_id,
        project
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Internal Server Error'  },
      { status: 500 }
    );
  }
}