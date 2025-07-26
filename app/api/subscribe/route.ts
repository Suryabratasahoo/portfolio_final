import connectDB from "@/lib/connectDb";
import {NextResponse,NextRequest} from "next/server";
import Subscriber from "@/models/subscriber";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email } = await request.json();
    // Check if the email is already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 409 });
    }

    // Create a new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}