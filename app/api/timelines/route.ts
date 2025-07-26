import connectDB from "@/lib/connectDb";
import { NextResponse, NextRequest } from "next/server";

import { Timeline } from "@/models/timeline";

export async function GET(request: NextRequest) {
    try {
        connectDB();
        const timelines = await Timeline.find();
        return NextResponse.json({ timelines: timelines }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const { timelines: changedTimelines }: { timelines: Array<{ _id: string; [key: string]: any }> } = await request.json();
    console.log("Changed timeline:", changedTimelines);
    try {
        connectDB();
        const updatePromises = changedTimelines.map((timeline: { _id: string; [key: string]: any }) =>
            Timeline.findByIdAndUpdate(
                timeline._id,
                { $set: { ...timeline } },
                { new: true }
            )
        );

        await Promise.all(updatePromises);
        return NextResponse.json({ message: "Timelines updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating timelines:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(reqeust:NextRequest){
    try{
        connectDB();
        const {id}=await reqeust.json();
        console.log("Deleted timeline:", id);
        await Timeline.findByIdAndDelete(id);
        return NextResponse.json({ message: "Timeline deleted successfully" }, { status: 200 });

    }catch(error){
        console.error("Error deleting timeline:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try{
        connectDB();
        const {timeline}=await request.json();
        console.log("Created timeline:", timeline);
        const newTimeline = new Timeline(timeline);
        await newTimeline.save();
        return NextResponse.json({ message: "Timeline created successfully" }, { status: 200 });
    }catch(error){
        console.error("Error creating timeline:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        
    }
}