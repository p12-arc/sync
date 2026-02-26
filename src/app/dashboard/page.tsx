import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import TaskBoard from "@/components/TaskBoard";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
    const cookieStore = cookies();
    const token = cookieStore.get("tm_token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar user={user} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">
                        Good day, <span className="text-brand-500">{user.name.split(" ")[0]}</span> 👋
                    </h1>
                    <p className="text-gray-400 mt-1">Here&apos;s an overview of your tasks</p>
                </div>
                <TaskBoard />
            </main>
        </div>
    );
}
