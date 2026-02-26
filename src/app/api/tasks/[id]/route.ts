import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { encrypt, safeDecrypt } from "@/lib/crypto";
import { updateTaskSchema } from "@/lib/validations";

function getUserFromRequest(req: NextRequest) {
    const token = req.cookies.get("tm_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

// PUT /api/tasks/[id] — update task
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const parsed = updateTaskSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        await connectDB();

        const task = await Task.findById(params.id);
        if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        // Authorization: ensure task belongs to current user
        if (task.userId.toString() !== user.userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updates: Record<string, unknown> = {};
        if (parsed.data.title !== undefined) updates.title = parsed.data.title;
        if (parsed.data.status !== undefined) updates.status = parsed.data.status;
        if (parsed.data.description !== undefined) {
            updates.description = parsed.data.description
                ? encrypt(parsed.data.description)
                : "";
        }

        const updated = await Task.findByIdAndUpdate(params.id, updates, { new: true }).lean() as Record<string, unknown> | null;

        return NextResponse.json({
            task: {
                ...updated,
                description: safeDecrypt((updated?.description as string) ?? ""),
            },
        });
    } catch (err) {
        console.error("[UPDATE TASK]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/tasks/[id]
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await connectDB();

        const task = await Task.findById(params.id);
        if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        if (task.userId.toString() !== user.userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await Task.findByIdAndDelete(params.id);
        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("[DELETE TASK]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
