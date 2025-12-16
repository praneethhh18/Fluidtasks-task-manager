import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, AtSign, Heart, Hash, ArrowRight, Sparkles, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Onboarding({ onComplete, initialData }) {
    const [step, setStep] = useState(1);
    const [customInterest, setCustomInterest] = useState("");
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        username: initialData?.username || "",
        email: initialData?.email || "",
        gender: initialData?.gender || "",
        interests: initialData?.interests || []
    });

    const INTERESTS_OPTIONS = [
        "Productivity", "Coding", "Design", "AI", "Business", "Health", "Reading", "Gaming"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.username) {
            onComplete(formData);
        }
    };

    const toggleInterest = (interest) => {
        const current = formData.interests;
        if (current.includes(interest)) {
            setFormData({ ...formData, interests: current.filter(i => i !== interest) });
        } else {
            if (current.length < 10) { // Increased limit
                setFormData({ ...formData, interests: [...current, interest] });
            }
        }
    };

    const addCustomInterest = (e) => {
        e.preventDefault();
        if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
            setFormData({ ...formData, interests: [...formData.interests, customInterest.trim()] });
            setCustomInterest("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative p-4">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30"
                    >
                        <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        {initialData ? "Edit Profile" : "Welcome to FluidTasks"}
                    </h1>
                    <p className="text-slate-400 text-lg">
                        {initialData ? "Update your workspace preferences." : "Let's personalize your workspace."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors w-5 h-5 pointer-events-none z-10" />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    className="w-full bg-slate-900/50 border border-white/10 focus:border-indigo-500/50 rounded-xl py-3 pl-14 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Username</label>
                            <div className="relative group">
                                <AtSign className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors w-5 h-5 pointer-events-none z-10" />
                                <input
                                    type="text"
                                    placeholder="your_username"
                                    required
                                    className="w-full bg-slate-900/50 border border-white/10 focus:border-indigo-500/50 rounded-xl py-3 pl-14 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors w-5 h-5 pointer-events-none z-10" />
                                <input
                                    type="email"
                                    placeholder="hello@example.com"
                                    className="w-full bg-slate-900/50 border border-white/10 focus:border-indigo-500/50 rounded-xl py-3 pl-14 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Gender</label>
                            <select
                                className="w-full bg-slate-900/50 border border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium appearance-none"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="" className="bg-slate-900 text-slate-500">Select Gender</option>
                                <option value="Male" className="bg-slate-900">Male</option>
                                <option value="Female" className="bg-slate-900">Female</option>
                                <option value="Other" className="bg-slate-900">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-500" />
                            Interests <span className="text-xs font-normal text-slate-500">(Pick or Add yours)</span>
                        </label>

                        {/* Custom Interest Input */}
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add custom interest..."
                                className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                                value={customInterest}
                                onChange={(e) => setCustomInterest(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addCustomInterest(e)}
                            />
                            <button
                                type="button"
                                onClick={addCustomInterest}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl text-sm font-bold transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                            {/* Custom Added (Show First) */}
                            {formData.interests.filter(i => !INTERESTS_OPTIONS.includes(i)).map((interest) => (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25 scale-105 flex items-center gap-2 hover:bg-red-500/20 hover:border-red-500/50"
                                >
                                    {interest}
                                    <X className="w-3 h-3 opacity-70" />
                                </button>
                            ))}

                            {/* Predefined */}
                            {INTERESTS_OPTIONS.map((interest) => (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
                                        formData.interests.includes(interest)
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105"
                                            : "bg-slate-900/50 border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10"
                                    )}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
                        >
                            {initialData ? "Save Changes" : "Get Started"}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
