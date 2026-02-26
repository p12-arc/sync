"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Save, Plus } from "lucide-react";
import { Task } from "./TaskBoard";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    editTask: Task | null;
};

export default function TaskModal({ isOpen, onClose, onSaved, editTask }: Props) {
    const [form, setForm] = useState({ title: "", description: "", status: "todo" as Task["status"] });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editTask) {
            setForm({ title: editTask.title, description: editTask.description || "", status: editTask.status });
        } else {
            setForm({ title: "", description: "", status: "todo" });
        }
        setErrors({});
    }, [editTask, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = "Title is required";
        if (form.title.length > 200) e.title = "Title too long";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const url = editTask ? `/api/tasks/${editTask._id}` : "/api/tasks";
            const method = editTask ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to save task");
                return;
            }
            toast.success(editTask ? "Task updated!" : "Task created!");
            onSaved();
        } catch {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="glass-card w-full max-w-lg animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            {editTask ? <><Save className="w-5 h-5 text-brand-500" /> Edit Task</> : <><Plus className="w-5 h-5 text-brand-500" /> New Task</>}
                        </h2>
                        <button id="close-modal" onClick={onClose}
                            className="p-2 rounded-xl hover:bg-white/[0.08] text-gray-500 hover:text-white transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title *</label>
                            <input
                                id="task-title"
                                type="text"
                                className={`input-field ${errors.title ? "border-red-500" : ""}`}
                                placeholder="What needs to be done?"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                autoFocus
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Description <span className="text-gray-600">(stored encrypted)</span>
                            </label>
                            <textarea
                                id="task-description"
                                className="input-field resize-none"
                                rows={4}
                                placeholder="Add details about this task..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(["todo", "in-progress", "done"] as Task["status"][]).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        id={`status-${s}`}
                                        onClick={() => setForm({ ...form, status: s })}
                                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all capitalize ${form.status === s
                                                ? s === "todo"
                                                    ? "border-gray-400 bg-gray-400/20 text-gray-200"
                                                    : s === "in-progress"
                                                        ? "border-amber-400 bg-amber-400/20 text-amber-200"
                                                        : "border-green-400 bg-green-400/20 text-green-200"
                                                : "border-white/[0.08] text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {s === "in-progress" ? "In Progress" : s === "todo" ? "To Do" : "Done"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="btn-ghost flex-1">
                                Cancel
                            </button>
                            <button id="save-task-btn" type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>{editTask ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {editTask ? "Save Changes" : "Create Task"}</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
