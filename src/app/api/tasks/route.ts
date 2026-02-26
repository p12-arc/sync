import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { encrypt, safeDecrypt } from "@/lib/crypto";
import { createTaskSchema, taskQuerySchema } from "@/lib/validations";

function getUserFromRequest(req: NextRequest) {
    const token = req.cookies.get("tm_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

// GET /api/tasks — paginated, filtered, searchable
export async function GET(req: NextRequest) {
    const user = getUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const queryParsed = taskQuerySchema.safeParse({
        page: searchParams.get("page") ?? 1,
        limit: searchParams.get("limit") ?? 10,
        status: searchParams.get("status") ?? "all",
        search: searchParams.get("search") ?? "",
    });

    if (!queryParsed.success) {
        return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }

    const { page, limit, status, search } = queryParsed.data;

    try {
        await connectDB();

        // Build filter
        const filter: Record<string, unknown> = { userId: user.userId };
        if (status !== "all") filter.status = status;
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const total = await Task.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Decrypt description for response
        const decryptedTasks = tasks.map((t) => ({
            ...t,
            description: safeDecrypt(t.description as string),
        }));

        return NextResponse.json({
            tasks: decryptedTasks,
            pagination: { page, limit, total, totalPages },
        });
    } catch (err) {
        console.error("[GET TASKS]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/tasks — create task
export async function POST(req: NextRequest) {
    const user = getUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = createTaskSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { title, description, status } = parsed.data;

        await connectDB();

        const encryptedDesc = description ? encrypt(description) : "";

        const task = await Task.create({
            title,
            description: encryptedDesc,
            status,
            userId: user.userId,
        });

        return NextResponse.json(
            {
                task: {
                    ...task.toObject(),
                    description, // return plain text to client
                },
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("[CREATE TASK]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
