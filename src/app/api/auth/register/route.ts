import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken, setTokenCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, password } = parsed.data;

        await connectDB();

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        const user = await User.create({ name, email, password });

        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        const response = NextResponse.json(
            { message: "Registration successful", user: { id: user._id, name, email } },
            { status: 201 }
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
        console.error("[REGISTER]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
