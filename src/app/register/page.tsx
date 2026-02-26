"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus, Zap } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name || form.name.length < 2) e.name = "Name must be at least 2 characters";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
        if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Registration failed");
                return;
            }
            toast.success("Account created! Welcome aboard 🎉");
            router.push("/dashboard");
            router.refresh();
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    type Field = "name" | "email" | "password" | "confirm";
    const update = (field: Field, value: string) => setForm((f) => ({ ...f, [field]: value }));

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 mb-4">
                        <Zap className="w-7 h-7 text-brand-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
                    <p className="text-gray-400">Start managing tasks like a pro</p>
                </div>

                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
                            <input id="name" type="text" autoComplete="name"
                                className={`input-field ${errors.name ? "border-red-500" : ""}`}
                                placeholder="John Doe"
                                value={form.name} onChange={(e) => update("name", e.target.value)} />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                            <input id="reg-email" type="email" autoComplete="email"
                                className={`input-field ${errors.email ? "border-red-500" : ""}`}
                                placeholder="you@example.com"
                                value={form.email} onChange={(e) => update("email", e.target.value)} />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                            <div className="relative">
                                <input id="reg-password" type={showPass ? "text" : "password"} autoComplete="new-password"
                                    className={`input-field pr-11 ${errors.password ? "border-red-500" : ""}`}
                                    placeholder="Min. 8 characters"
                                    value={form.password} onChange={(e) => update("password", e.target.value)} />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
                            <input id="confirm-password" type={showPass ? "text" : "password"} autoComplete="new-password"
                                className={`input-field ${errors.confirm ? "border-red-500" : ""}`}
                                placeholder="Repeat your password"
                                value={form.confirm} onChange={(e) => update("confirm", e.target.value)} />
                            {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
                        </div>

                        <button id="register-btn" type="submit" disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><UserPlus className="w-4 h-4" /> Create Account</>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-400 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-brand-500 hover:text-brand-400 font-semibold transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
