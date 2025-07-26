import connectDB from "@/lib/connectDb";
import { NextResponse, NextRequest } from "next/server";
import Stats from "@/models/stats";

export async function GET(request:NextRequest){
    try{
        connectDB();
        const stats=await Stats.find();
        return NextResponse.json({ stats }, { status: 200 });
    }catch(error){
        console.error("Error fetching stats:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request:NextRequest){
    const { stats: changedStats }: { stats: Array<{ id: number; [key: string]: any }> } = await request.json();

    try{
        connectDB();
        const updatePromises = changedStats.map((stat: { id: number; [key: string]: any }) =>
            Stats.findByIdAndUpdate(
                stat._id,
                { $set: { ...stat } },
                { new: true }
            )
        );
        await Promise.all(updatePromises);
        return NextResponse.json({ message: "Stats updated successfully" }, { status: 200 });
    }catch(error){
        console.error("Error updating stats:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}