import mongoose, { Schema, Document, Types } from "mongoose";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface ITask extends Document {
    title: string;
    description: string; // stored encrypted
    status: TaskStatus;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: { type: String, default: "" },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo",
        },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    },
    { timestamps: true }
);

// Compound index for efficient user task queries
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Task ||
    mongoose.model<ITask>("Task", TaskSchema);
