import React, { useEffect, useState } from 'react';
import { Plus, Clock, Activity, Loader2, Sparkles, Filter, Bell, Trophy, Medal, Star, CheckCircle2 } from 'lucide-react';
import api from '../api';
import { TaskCard } from './TaskCard';
import { TaskDetailModal } from './TaskDetailModal';
import { WorkplaceSection } from './WorkplaceSection';
import { motion, AnimatePresence } from 'framer-motion';

export function TaskBoard() {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [notification, setNotification] = useState(null);
    const [achievement, setAchievement] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    // New Feature State
    const [filterText, setFilterText] = useState("");
    const [activeTag, setActiveTag] = useState(null);
    const [isListening, setIsListening] = useState(false);

    // Derived state for unique tags
    const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(filterText.toLowerCase());
        const matchesTag = activeTag ? t.tags?.includes(activeTag) : true;
        return matchesSearch && matchesTag;
    });

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setNewTaskTitle(prev => prev ? `${prev} ${transcript} ` : transcript);
            };
            recognition.start();
        } else {
            alert("Voice input is not supported in this browser.");
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    useEffect(() => {
        // Request Notification permission
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        fetchTasks();
        const interval = setInterval(async () => {
            tasks.forEach(async (t) => {
                if (!t.completed && t.due_date) {
                    try {
                        const res = await api.get(`/ tasks / ${t.id}/reminder`);
                        const msg = res.data.message;
                        if (msg.includes("Reminder") || msg.includes("Heads up")) {
                            setNotification(msg);
                            setTimeout(() => setNotification(null), 8000);

                            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
                            audio.play().catch(e => console.log("Audio play failed (interaction needed first):", e));

                            if (Notification.permission === "granted") {
                                new Notification("FluidTasks Alert 🚨", {
                                    body: msg,
                                    icon: "/vite.svg"
                                });
                            }
                        }
                    } catch (e) { }
                }
            });
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [tasks.length]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setIsAdding(true);

        // Parse Smart Tags (#tag)
        const tags = newTaskTitle.match(/#[\w-]+/g)?.map(t => t.slice(1)) || [];

        // Default to tomorrow if not selected, otherwise use selected
        let dueDateIso = null;
        if (newTaskDueDate) {
            const d = new Date(newTaskDueDate);
            dueDateIso = d.toISOString();
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dueDateIso = tomorrow.toISOString();
        }

        try {
            // Small artificial delay to show animation (premium feel)
            await new Promise(r => setTimeout(r, 600));

            const res = await api.post('/tasks', {
                title: newTaskTitle,
                due_date: dueDateIso,
                tags: tags
            });
            setTasks([...tasks, res.data]);
            setNewTaskTitle("");
            setNewTaskDueDate("");

            // Micro Feedback
            setNotification("Task added ✨");
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            console.error("Failed to add task", err);
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdateTaskInList = (updatedTask) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleToggle = async (id) => {
        try {
            const res = await api.put(`/tasks/${id}/toggle`);
            // Backend now returns { task: ..., achievement_update: ..., xp_gained: ... }
            // or fallback if endpoint hasn't updated yet (though we updated it)
            const updatedTask = res.data.task || res.data;

            if (!updatedTask || typeof updatedTask !== 'object' || !updatedTask.id) {
                console.error("Received invalid task data from server:", res.data);
                return;
            }

            setTasks(tasks.map(t => t.id === id ? updatedTask : t));

            // Check for achievement (Level Up only)
            if (res.data.achievement_update) {
                setAchievement({ message: res.data.achievement_update, xp: res.data.xp_gained });
                setTimeout(() => setAchievement(null), 4000);

                // Victory Sound
                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3");
                audio.volume = 0.5;
                audio.play().catch(e => { });
            } else if (updatedTask.completed) {
                // Micro Feedback for normal completion
                setNotification("Task completed");
                setTimeout(() => setNotification(null), 1500);
            }

        } catch (err) {
            console.error("Failed to toggle task", err);
        }
    };

    const handleDelete = async (id) => {
        // Confirmation is handled via UI or undo (simplified for now)
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
            if (selectedTask?.id === id) setSelectedTask(null);

            // Micro Feedback
            setNotification("Task deleted 🗑️");
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    // Live Clock State
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <header className="relative">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 flex-wrap">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 min-w-[280px]"
                    >
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 leading-tight">
                            {getGreeting()}, <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">User</span>
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-md leading-relaxed">
                            You've got
                            <span className="font-bold text-slate-900 dark:text-white mx-1">
                                {tasks.filter(t => !t.completed).length} tasks
                            </span>
                            on your plate today. Let's get moving! 🚀
                        </p>
                    </motion.div>

                    {/* Metrics Deck */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 flex-shrink-0"
                    >
                        {/* Total Card */}
                        <div className="flex-1 min-w-[140px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm flex items-center gap-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</p>
                                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{tasks.length}</p>
                            </div>
                        </div>

                        {/* Pending Card */}
                        <div className="flex-1 min-w-[140px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm flex items-center gap-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-orange-500/5 dark:bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                <Loader2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending</p>
                                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{tasks.filter(t => !t.completed).length}</p>
                            </div>
                        </div>

                        {/* Done Card (Progress) */}
                        <div className="flex-1 min-w-[140px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm flex items-center gap-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-green-500/5 dark:bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative p-1">
                                {/* Simple Circular Progress */}
                                <svg className="w-9 h-9 transform -rotate-90">
                                    <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                                    <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={100} strokeDashoffset={100 - (tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0)} className="text-green-500 transition-all duration-1000 ease-out" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Done</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{tasks.filter(t => t.completed).length}</p>
                                    <span className="text-[10px] text-slate-400 font-bold">
                                        /{tasks.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Add Task Input (Primary) */}
            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                onSubmit={handleAddTask}
                className="relative group p-2 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row gap-4 transition-transform focus-within:scale-[1.01] duration-300"
            >
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add new task here... (e.g., 'Finish project #urgent')"
                        disabled={isAdding}
                        className="w-full pl-8 pr-14 py-5 text-xl font-medium bg-transparent border-none outline-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40 text-slate-800 dark:text-slate-100"
                    />
                    {/* Mic Button (Secondary) */}
                    <button
                        type="button"
                        onClick={startListening}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        title="Voice Input"
                    >
                        {isListening ? (
                            <div className="w-6 h-6 flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <Loader2 className="w-5 h-5" />
                            </div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="23" /><line x1="8" x2="16" y1="23" y2="23" /></svg>
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-3 pr-3 pl-4 md:pl-0 pb-2 md:pb-0">
                    <input
                        type="datetime-local"
                        className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-primary/20 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        id="task-due-date"
                    />
                    <button
                        type="submit"
                        disabled={isAdding || !newTaskTitle.trim()}
                        className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                    >
                        {isAdding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                        <span className="hidden md:inline">Add</span>
                    </button>
                </div>
            </motion.form>

            {/* Workplace Section */}
            <WorkplaceSection />

            {/* Filter Bar (Secondary) */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-sm group">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full bg-slate-50/50 dark:bg-slate-900/50 pl-10 pr-4 py-2.5 rounded-xl border border-transparent hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 hover:shadow-sm focus:shadow-md transition-all focus:ring-2 ring-primary/10 text-sm text-slate-600 dark:text-slate-300"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary/70 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                </div>

                {/* Tag Cloud */}
                {allTags.length > 0 && (
                    <div className="flex gap-2 flex-wrap items-center justify-end w-full md:w-auto">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline opacity-70">Filter:</span>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${activeTag === tag
                                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                    : "bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-300"
                                    }`}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-10">
                {/* Active Tasks */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">Ongoing Tasks</h2>
                        <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-500">
                            {filteredTasks.filter(t => !t.completed).length}
                        </span>
                    </motion.div>

                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredTasks.filter(t => !t.completed).map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.3, delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <TaskCard
                                        task={task}
                                        onClick={setSelectedTask}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredTasks.filter(t => !t.completed).length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-muted-foreground font-medium">
                                    {filterText || activeTag ? "No tasks found matching filter." : "All caught up! No active tasks."}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </section>

                {/* Completed Tasks */}
                {filteredTasks.some(t => t.completed) && (
                    <section className="opacity-80 hover:opacity-100 transition-opacity duration-300">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold">Completed</h2>
                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-500">
                                {filteredTasks.filter(t => t.completed).length}
                            </span>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredTasks.filter(t => t.completed).map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <TaskCard
                                            task={task}
                                            onClick={setSelectedTask}
                                            onToggle={handleToggle}
                                            onDelete={handleDelete}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedTask && (
                    <TaskDetailModal
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        onUpdate={handleUpdateTaskInList}
                        onDelete={handleDelete}
                    />
                )}
            </AnimatePresence>

            {/* Achievement Popup */}
            <AnimatePresence>
                {achievement && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-white dark:bg-slate-900 border border-yellow-500/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center relative overflow-hidden backdrop-blur-3xl transform">
                            <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
                            <Medal className="w-20 h-20 text-yellow-500 animate-bounce drop-shadow-lg" />
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Achievement Unlocked!</h3>
                                <p className="text-xl text-slate-600 dark:text-slate-300 font-bold">{achievement.message}</p>
                            </div>
                            {achievement.xp > 0 && (
                                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full font-black text-lg shadow-xl shadow-yellow-500/30 transform -rotate-2">
                                    +{achievement.xp} XP
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm border border-white/10"
                    >
                        <Bell className="w-6 h-6 text-yellow-400 flex-shrink-0 animate-bounce" />
                        <div>
                            <h4 className="font-bold text-sm">Reminder</h4>
                            <p className="text-sm leading-tight opacity-90">{notification}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
