import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';
import { cn } from '../lib/utils';

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetch all tasks to map them on calendar
        api.get('/tasks').then(res => setTasks(res.data)).catch(console.error);
    }, []);

    const days = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="p-2 hover:bg-accent rounded-full"><ChevronLeft /></button>
                    <span className="font-semibold text-lg min-w-[150px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-accent rounded-full"><ChevronRight /></button>
                </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="grid grid-cols-7 gap-4 text-center mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="font-medium text-muted-foreground">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {days.map(day => {
                        const dayTasks = tasks.filter(t => t.due_date && isSameDay(new Date(t.due_date), day));
                        return (
                            <div
                                key={day.toISOString()}
                                className={cn(
                                    "min-h-[100px] border rounded-lg p-2 flex flex-col gap-1 transition-colors hover:bg-accent/30",
                                    !isSameMonth(day, currentDate) && "opacity-50",
                                    isToday(day) && "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                                )}
                            >
                                <div className={cn("text-sm font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full", isToday(day) && "bg-primary text-primary-foreground")}>
                                    {format(day, 'd')}
                                </div>
                                {dayTasks.map(t => (
                                    <div key={t.id} className="text-[10px] bg-secondary px-1 py-0.5 rounded truncate border">
                                        {t.title}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
