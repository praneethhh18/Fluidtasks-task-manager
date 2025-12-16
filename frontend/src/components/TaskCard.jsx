import React from 'react';
import { cn } from '../lib/utils';
import { CheckCircle2, Circle, Clock, Flame, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function TaskCard({ task, onClick, onToggle, onDelete }) {
    if (!task) return null;

    const priorityInfo = {
        High: { color: "text-red-600 bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400", label: "Urgent" },
        Medium: { color: "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400", label: "Medium" },
        Low: { color: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400", label: "Routine" },
    }[task.priority] || { color: "text-slate-500 bg-slate-100", label: "Normal" };

    return (
        <div
            className={cn(
                "group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden",
                task.completed && "opacity-60 bg-slate-50/50 dark:bg-slate-950/50 grayscale-[0.5]"
            )}
            onClick={() => onClick(task)}
        >
            {/* Delete Button (Hover) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                }}
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all shadow-sm transform scale-90 hover:scale-100"
                title="Delete Task"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {/* Decorative gradient blob */}
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="flex items-start justify-between gap-4 relative z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(task.id);
                    }}
                    className="mt-1 text-slate-400 hover:text-primary transition-all active:scale-90"
                >
                    {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500/10" />
                    ) : (
                        <Circle className="w-6 h-6 stroke-[1.5]" />
                    )}
                </button>

                <div className="flex-1 space-y-2">
                    <div>
                        <span className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border", priorityInfo.color)}>
                            {priorityInfo.label}
                        </span>
                    </div>

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {task.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <h4 className={cn("font-bold text-lg leading-tight text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors", task.completed && "line-through text-muted-foreground")}>
                        {task.title}
                    </h4>

                    <div className="flex items-center gap-3 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {task.due_date && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}</span>
                            </div>
                        )}
                        {task.subtasks && task.subtasks.length > 0 && (
                            <div className="flex items-center gap-1">
                                <span>{task.subtasks.filter(t => t.completed).length}/{task.subtasks.length} subtasks</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {task.subtasks && task.subtasks.length > 0 && (
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-700 ease-out"
                        style={{ width: `${(task.subtasks.filter(t => t.completed).length / task.subtasks.length) * 100}%` }}
                    />
                </div>
            )}
        </div>
    );
}
