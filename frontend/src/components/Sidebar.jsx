import React from 'react';
import { LayoutDashboard, Calendar, BarChart3, Medal, Moon, Sun, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, user, onEditProfile }) {
    const navItems = [
        { id: 'board', label: 'Board', icon: LayoutDashboard },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'gamification', label: 'Progress', icon: Medal },
    ];

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';
    };

    return (
        <div className={cn(
            "h-screen bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-white/20 dark:border-white/5 flex flex-col p-4 shadow-2xl z-20 transition-all duration-300 ease-in-out relative",
            isOpen ? "w-72" : "w-20"
        )}>
            {/* Internal Header Layout */}
            <div className={cn("flex items-center justify-between mb-10 px-1 transition-all duration-300", !isOpen && "justify-center")}>
                <div
                    onClick={() => !isOpen && setIsOpen(true)}
                    className={cn(
                        "flex items-center gap-3",
                        !isOpen && "cursor-pointer hover:scale-105 transition-transform"
                    )}
                >
                    <div className="w-10 h-10 min-w-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="text-white font-bold text-xl">F</span>
                    </div>
                    {isOpen && (
                        <div className="overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-4 duration-500">
                            <h1 className="font-bold text-xl tracking-tight leading-none">FluidTasks</h1>
                            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Workspace</span>
                        </div>
                    )}
                </div>

                {/* Collapse Button (Only visible when open) */}
                {isOpen && (
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-3.5 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-900/50",
                                !isOpen && "justify-center px-0"
                            )}
                            title={!isOpen ? item.label : undefined}
                        >
                            <Icon className={cn("w-5 h-5 min-w-5 transition-transform duration-300 group-hover:scale-110", isActive && "animate-pulse")} />
                            {isOpen && (
                                <span className="font-semibold tracking-wide whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                                    {item.label}
                                </span>
                            )}
                            {isActive && isOpen && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/50 backdrop-blur-sm" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User & Theme Section */}
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50">
                <div
                    onClick={onEditProfile}
                    className={cn(
                        "bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-2xl flex items-center border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group",
                        isOpen ? "justify-between gap-3" : "justify-center p-2 bg-transparent border-0"
                    )}
                >
                    {isOpen ? (
                        <>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 min-w-9 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                                    <span className="text-sm font-bold leading-tight truncate">{user?.name}</span>
                                    <span className="text-[10px] text-muted-foreground truncate opacity-70 group-hover:text-primary transition-colors">
                                        Edit Profile
                                    </span>
                                </div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <ThemeToggle />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4 items-center">
                            <div onClick={(e) => e.stopPropagation()}>
                                <ThemeToggle />
                            </div>
                            <div
                                className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-sm cursor-help hover:scale-105 transition-transform"
                                title={user?.name}
                            >
                                {getInitials(user?.name)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
