"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

export type Task = {
    _id: string;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done";
    createdAt: string;
};

type Pagination = { page: number; limit: number; total: number; totalPages: number };
type StatusFilter = "all" | "todo" | "in-progress" | "done";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
];

export default function TaskBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 9, total: 0, totalPages: 1 });
    const [status, setStatus] = useState<StatusFilter>("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const fetchTasks = useCallback(async (page = 1, st = status, sq = search) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "9",
                status: st,
                search: sq,
            });
            const res = await fetch(`/api/tasks?${params}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setTasks(data.tasks);
            setPagination(data.pagination);
        } catch {
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [status, search]);

    useEffect(() => { fetchTasks(1, status, search); }, [status]); // eslint-disable-line

    // Debounce search
    const handleSearch = (val: string) => {
        setSearch(val);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => fetchTasks(1, status, val), 400);
    };

    const handlePageChange = (p: number) => fetchTasks(p, status, search);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this task?")) return;
        try {
            const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Task deleted");
            fetchTasks(pagination.page, status, search);
        } catch {
            toast.error("Failed to delete task");
        }
    };

    const handleSaved = () => {
        setModalOpen(false);
        setEditTask(null);
        fetchTasks(1, status, search);
    };

    // Stats
    const stats = [
        { label: "Total", value: pagination.total, color: "text-brand-500" },
    ];

    return (
        <div className="animate-fade-in">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        id="task-search"
                        type="text"
                        className="input-field pl-10"
                        placeholder="Search tasks by title..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {/* Add Task button */}
                <button
                    id="add-task-btn"
                    onClick={() => { setEditTask(null); setModalOpen(true); }}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    New Task
                </button>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-1 mb-6 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] w-fit">
                {STATUS_TABS.map((t) => (
                    <button
                        key={t.value}
                        id={`filter-${t.value}`}
                        onClick={() => setStatus(t.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${status === t.value
                                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                                : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Task Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                        <Filter className="w-7 h-7 text-gray-600" />
                    </div>
                    <p className="text-gray-400 text-lg font-medium">No tasks found</p>
                    <p className="text-gray-600 text-sm mt-1">
                        {search ? "Try a different search term" : "Create your first task to get started"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={() => { setEditTask(task); setModalOpen(true); }}
                            onDelete={() => handleDelete(task._id)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                    <p className="text-sm text-gray-500">
                        {pagination.total} task{pagination.total !== 1 ? "s" : ""} · Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            id="prev-page"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="btn-ghost flex items-center gap-1 py-2 px-3 disabled:opacity-30"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === pagination.page
                                        ? "bg-brand-500 text-white"
                                        : "bg-white/[0.06] text-gray-400 hover:text-white"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            id="next-page"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="btn-ghost flex items-center gap-1 py-2 px-3 disabled:opacity-30"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <TaskModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditTask(null); }}
                onSaved={handleSaved}
                editTask={editTask}
            />
        </div>
    );
}
