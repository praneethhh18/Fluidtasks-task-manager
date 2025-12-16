import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, X, Globe, ExternalLink, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';

export function WorkplaceSection() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apps, setApps] = useState([]);

    const DEFAULT_APPS = [
        { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', icon: null },
        { id: 'docs', name: 'Docs', url: 'https://docs.google.com', icon: null },
        { id: 'meet', name: 'Meet', url: 'https://meet.google.com', icon: null },
        { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', icon: null },
        { id: 'notion', name: 'Notion', url: 'https://notion.so', icon: null },
    ];

    useEffect(() => {
        const savedApps = localStorage.getItem('fluid_workplace_apps');
        const savedState = localStorage.getItem('fluid_workplace_expanded');

        if (savedApps) {
            setApps(JSON.parse(savedApps));
        } else {
            setApps(DEFAULT_APPS);
        }

        if (savedState !== null) {
            setIsExpanded(JSON.parse(savedState));
        }
    }, []);

    const toggleExpand = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem('fluid_workplace_expanded', JSON.stringify(newState));
    };

    const addApp = (newApp) => {
        const updatedApps = [...apps, { ...newApp, id: Date.now().toString() }];
        setApps(updatedApps);
        localStorage.setItem('fluid_workplace_apps', JSON.stringify(updatedApps));
        setIsModalOpen(false);
    };

    const removeApp = (appId, e) => {
        e.stopPropagation();
        e.preventDefault();
        const updatedApps = apps.filter(a => a.id !== appId);
        setApps(updatedApps);
        localStorage.setItem('fluid_workplace_apps', JSON.stringify(updatedApps));
    };

    return (
        <section className="mb-8 select-none">
            {/* Header */}
            <div
                onClick={toggleExpand}
                className="flex items-center justify-between cursor-pointer group mb-4"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-500 group-hover:text-indigo-600 transition-colors">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">Workplace</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">Quick access to your daily tools</p>
                    </div>
                </div>
                <div className={cn(
                    "p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300",
                    isExpanded ? "rotate-180" : "rotate-0"
                )}>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>

            {/* Content */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x">
                            {apps.map((app) => (
                                <AppCard key={app.id} app={app} onRemove={(e) => removeApp(app.id, e)} />
                            ))}

                            {/* Add Button */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group flex-shrink-0 w-[84px] flex flex-col items-center gap-2 snap-start"
                            >
                                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-semibold text-slate-500 group-hover:text-indigo-500 transition-colors">Add App</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal */}
            <AddAppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addApp}
            />
        </section>
    );
}

function AppCard({ app, onRemove }) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${app.url}&sz=128`;

    return (
        <div className="group relative flex-shrink-0 w-[84px] flex flex-col items-center gap-2 snap-start">
            <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-none flex flex-col items-center gap-2 w-full"
            >
                <div className="relative w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-indigo-100 dark:group-hover:border-indigo-900 overflow-hidden">
                    <img
                        src={faviconUrl}
                        alt={app.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center text-slate-300 dark:text-slate-600">
                        <Globe className="w-8 h-8" />
                    </div>
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate max-w-full group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {app.name}
                </span>
            </a>

            {/* Hover overlay for delete */}
            <div className="absolute top-0 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={onRemove}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm transform hover:scale-110 transition-all"
                    title="Remove App"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

function AddAppModal({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && url) {
            let formattedUrl = url;
            if (!/^https?:\/\//i.test(url)) {
                formattedUrl = `https://${url}`;
            }
            onSubmit({ name, url: formattedUrl });
            setName('');
            setUrl('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Add Shortcut</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-500 ml-1">App Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Figma"
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-500 ml-1">Ref URL</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="figma.com"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!name || !url}
                        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        Add to Workplace
                    </button>
                </form>
            </div>
        </div>
    );
}
