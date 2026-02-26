import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;

        await connectDB();

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const valid = await user.comparePassword(password);
        if (!valid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        const response = NextResponse.json(
            { message: "Login successful", user: { id: user._id, name: user.name, email: user.email } },
            { status: 200 }
        );

        response.cookies.set("tm_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
    } catch (err) {
        console.error("[LOGIN]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
