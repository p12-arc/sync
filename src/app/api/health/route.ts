import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            database: "connected",
            environment: process.env.NODE_ENV
        });
    } catch (error) {
        return NextResponse.json({
            status: "unhealthy",
            database: "disconnected",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 503 });
    }
}
