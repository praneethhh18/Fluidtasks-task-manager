import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, Clock, Trash2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import api from '../api';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export function TaskDetailModal({ task, onClose, onUpdate, onDelete }) {
    const [loadingBreakdown, setLoadingBreakdown] = useState(false);
    const [localTask, setLocalTask] = useState(task);

    useEffect(() => {
        setLocalTask(task);
    }, [task]);

    if (!task) return null;

    const handleBreakdown = async () => {
        setLoadingBreakdown(true);
        try {
            const res = await api.post(`/tasks/${task.id}/breakdown`);
            const updatedTask = { ...localTask, subtasks: res.data };
            setLocalTask(updatedTask);
            onUpdate(updatedTask);
        } catch (err) {
            console.error("Failed to generate breakdown", err);
        } finally {
            setLoadingBreakdown(false);
        }
    };

    const toggleSubtask = (index) => {
        const newSubtasks = [...localTask.subtasks];
        newSubtasks[index].completed = !newSubtasks[index].completed;
        setLocalTask({ ...localTask, subtasks: newSubtasks });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className={cn("text-[10px] bg-white dark:bg-slate-800 border px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm",
                                localTask.priority === "High" ? "text-red-500 border-red-200" : "text-slate-500"
                            )}>
                                {localTask.priority} Priority
                            </span>
                            {localTask.due_date && (
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    {(() => {
                                        try {
                                            return format(new Date(localTask.due_date), "MMM d, h:mm a");
                                        } catch (e) {
                                            return "Invalid Date";
                                        }
                                    })()}
                                </div>
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{localTask.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                onDelete(localTask.id);
                                onClose();
                            }}
                            className="p-2 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded-full border border-slate-200 dark:border-slate-700 transition-colors shadow-sm group"
                            title="Delete Task"
                        >
                            <Trash2 className="w-5 h-5 group-hover:scale-90 transition-transform" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto">
                    {/* AI Insight */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-2xl border border-blue-100 dark:border-blue-900">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Sparkles className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                                <Sparkles className="w-4 h-4" />
                                <h3 className="text-sm uppercase tracking-wider">AI Priority Reasoning</h3>
                            </div>
                            <p className="text-indigo-900 dark:text-indigo-100 leading-relaxed font-medium">
                                {localTask.priority_reasoning}
                            </p>
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Action Plan
                                <span className="text-sm font-normal text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                    {(localTask.subtasks || []).length}
                                </span>
                            </h3>
                            {(localTask.subtasks || []).length === 0 && (
                                <button
                                    onClick={handleBreakdown}
                                    disabled={loadingBreakdown}
                                    className="group flex items-center gap-2 text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loadingBreakdown ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4 text-yellow-400" />
                                    )}
                                    Generate Steps
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {(localTask.subtasks || []).length > 0 ? (
                                (localTask.subtasks || []).map((sub, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={idx}
                                        onClick={() => toggleSubtask(idx)}
                                        className={cn(
                                            "group flex items-center gap-4 p-4 rounded-xl border border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all cursor-pointer",
                                            sub.completed && "bg-slate-50/50 opacity-60"
                                        )}
                                    >
                                        {sub.completed ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-100" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                                        )}
                                        <span className={cn("font-medium text-slate-700 dark:text-slate-200", sub.completed && "line-through text-slate-400")}>
                                            {sub.title}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                    <p className="text-sm text-muted-foreground">No steps yet. Use AI to break this task down.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                    <button
                        onClick={async () => {
                            try {
                                const res = await api.put(`/tasks/${task.id}/toggle`);
                                // Backend now returns { task: ..., achievement_update: ..., xp_gained: ... }
                                const updated = res.data.task || res.data;
                                setLocalTask(updated);
                                onUpdate(updated);
                                onClose();
                            } catch (e) { console.error(e); }
                        }}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95",
                            localTask.completed
                                ? "bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                : "bg-green-600 text-white hover:bg-green-700 shadow-green-200 dark:shadow-none"
                        )}
                    >
                        {localTask.completed ? (
                            <>
                                <ArrowRight className="w-5 h-5 rotate-180" />
                                Mark as Incomplete
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Mark as Completed
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
