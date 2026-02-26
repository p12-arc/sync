"use client";
import { Task } from "./TaskBoard";
import { Calendar, Edit2, Trash2, Clock, CheckCircle, Circle } from "lucide-react";

const STATUS_CONFIG = {
    todo: {
        label: "To Do",
        icon: Circle,
        cls: "bg-gray-500/20 text-gray-300 border-gray-500/30",
        dot: "bg-gray-400",
    },
    "in-progress": {
        label: "In Progress",
        icon: Clock,
        cls: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        dot: "bg-amber-400",
    },
    done: {
        label: "Done",
        icon: CheckCircle,
        cls: "bg-green-500/20 text-green-300 border-green-500/30",
        dot: "bg-green-400",
    },
};

export default function TaskCard({
    task,
    onEdit,
    onDelete,
}: {
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const { label, cls, dot } = STATUS_CONFIG[task.status];
    const date = new Date(task.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="glass-card p-5 group hover:border-white/[0.15] transition-all duration-200 hover:translate-y-[-2px] animate-fade-in flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-white text-sm leading-snug flex-1 line-clamp-2">
                    {task.title}
                </h3>
                {/* Actions - visible on hover */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                        id={`edit-task-${task._id}`}
                        onClick={onEdit}
                        className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-brand-500/20 hover:text-brand-400 text-gray-500 transition-all"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        id={`delete-task-${task._id}`}
                        onClick={onDelete}
                        className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3 flex-1">
                    {task.description}
                </p>
            )}

            <div className="flex-1" />

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                {/* Status badge */}
                <span className={`status-badge border ${cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    {label}
                </span>

                {/* Date */}
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <Calendar className="w-3 h-3" />
                    {date}
                </div>
            </div>
        </div>
    );
}
