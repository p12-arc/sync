"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Zap, LogOut, User } from "lucide-react";
import { JWTPayload } from "@/lib/auth";

export default function Navbar({ user }: { user: JWTPayload }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        toast.success("Logged out");
        router.push("/");
        router.refresh();
    };

    return (
        <header className="border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30">
                        <Zap className="w-5 h-5 text-brand-500" />
                    </div>
                    <span className="font-bold text-white text-lg tracking-tight">TaskFlow</span>
                </div>

                {/* User + Logout */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300 font-medium">{user.name}</span>
                    </div>
                    <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white/[0.05] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 text-gray-400 hover:text-red-400 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
