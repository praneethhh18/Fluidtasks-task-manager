import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskBoard } from './components/TaskBoard';
import { CalendarView } from './components/CalendarView';
import { GamificationPanel } from './components/GamificationPanel';
import { ReportsView } from './components/ReportsView';
import { Onboarding } from './components/Onboarding';

function App() {
  const [activeTab, setActiveTab] = useState('board');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('fluid_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleUserSetup = (userData) => {
    localStorage.setItem('fluid_user', JSON.stringify(userData));
    setUser(userData);
    setIsEditingProfile(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'board':
        return <TaskBoard />;
      case 'calendar':
        return <CalendarView />;
      case 'reports':
        return <ReportsView />;
      case 'gamification':
        return <GamificationPanel />;
      default:
        return <TaskBoard />;
    }
  };

  if (isLoading) return null;

  if (!user || isEditingProfile) {
    return <Onboarding onComplete={handleUserSetup} initialData={user} />;
  }

  return (
    <div className="flex minimal-bg min-h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden relative selection:bg-primary/20">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
        onEditProfile={() => setIsEditingProfile(true)}
      />

      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth bg-transparent">
        <div className="container py-6 max-w-7xl mx-auto px-4 lg:px-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
