import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/connectDb';
import Project from '@/models/Project';
import { unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { Context } from 'vm';

export async function GET(request:Request, { params }:{params:{id:string}}) {
  try {
    await connectDB();
    const { id } = await params;
        
    const project = await Project.findById(id);
        
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }
        
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request:Request, { params }:{params:{id:string}}) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();
        
    const project = await Project.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
        
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }
        
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

interface ContextParams {
  params: {
    id: string;
  };
}



export async function DELETE(
  request: Request,
  { params }:{params:{id:string}}
) {
  try {
    await connectDB();
    const { id } = await params;
        
    const project = await Project.findById(id);
        
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }
        
    // Delete local image file if it exists
    if (project.filename) {
      const filePath: string = path.join(process.cwd(), 'public', 'upload', 'project', project.filename);
      
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
        }
      }
    }
        
    await Project.findByIdAndDelete(id);
        
    return NextResponse.json(
      { success: true, message: 'Project deleted successfully' }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}