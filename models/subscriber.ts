import mongoose, { Schema, model, models } from "mongoose";

export interface ISubscriber {
  email: string;
}

const subscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true, unique: true },
});

// Check if model exists already, else create it
const Subscriber = models.Subscriber || model<ISubscriber>("Subscriber", subscriberSchema);

export default Subscriber;
