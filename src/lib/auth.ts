import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "tm_token";

export interface JWTPayload {
    userId: string;
    email: string;
    name: string;
}

export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

export function setTokenCookie(token: string) {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

export function clearTokenCookie() {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
    });
}

export function getTokenFromCookies(): string | null {
    const cookieStore = cookies();
    return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export function getCurrentUser(): JWTPayload | null {
    const token = getTokenFromCookies();
    if (!token) return null;
    return verifyToken(token);
}
