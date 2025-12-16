import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Target, Star } from 'lucide-react';
import api from '../api';
import { cn } from '../lib/utils';

export function GamificationPanel() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/gamification/stats').then(res => setStats(res.data)).catch(console.error);
    }, []);

    if (!stats) return <div>Loading stats...</div>;

    const nextLevelXp = stats.level * 100;
    const progress = (stats.xp / nextLevelXp) * 100;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Progress & Achievements</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Level Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <Trophy className="w-8 h-8 text-yellow-300" />
                        <span className="text-2xl font-bold">Level {stats.level}</span>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2 font-medium">
                            <span>XP Progress</span>
                            <span>{stats.xp} / {nextLevelXp} XP</span>
                        </div>
                        <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Streak Card */}
                <div className="bg-card border p-6 rounded-2xl shadow-sm flex items-center gap-6">
                    <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                        <Flame className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-muted-foreground font-medium">Current Streak</h3>
                        <p className="text-4xl font-bold">{stats.streak_days} <span className="text-base font-normal text-muted-foreground">days</span></p>
                    </div>
                </div>

                {/* Today's Focus Card */}
                <div className="bg-card border p-6 rounded-2xl shadow-sm flex items-center gap-6">
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                        <Target className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-muted-foreground font-medium">Tasks Today</h3>
                        <p className="text-4xl font-bold">{stats.tasks_completed_today}</p>
                    </div>
                </div>
            </div>

            {/* Badges Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Earned Badges</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {stats.badges.length > 0 ? (
                        stats.badges.map((badge, idx) => (
                            <div key={idx} className="bg-card border p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-center hover:scale-105 transition-transform">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600">
                                    <Star className="w-6 h-6" />
                                </div>
                                <span className="font-semibold text-sm">{badge}</span>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-8 text-center text-muted-foreground bg-accent/20 rounded-xl border-2 border-dashed">
                            No badges yet. Complete tasks to level up!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
