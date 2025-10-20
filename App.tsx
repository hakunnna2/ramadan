
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tab, Reminder } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import CalendarTab from './components/CalendarTab';
import ProgressTab from './components/ProgressTab';
import InfoTab from './components/InfoTab';
import RemindersTab from './components/RemindersTab';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Calendar);
    const [ramadanDays, setRamadanDays] = useState<number>(() => parseInt(localStorage.getItem('ramadanDaysCount') || '30'));
    const [missedDays, setMissedDays] = useState<boolean[]>(() => JSON.parse(localStorage.getItem('ramadanMissedDays') || `[]`));
    const [madeUpDays, setMadeUpDays] = useState<number>(() => parseInt(localStorage.getItem('ramadanMadeUpDays') || '0'));
    const [reminders, setReminders] = useState<Reminder[]>(() => JSON.parse(localStorage.getItem('ramadanReminders') || '[]'));

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
    
    const currentYear = new Date().getFullYear();

    // Effect for PWA install prompt
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            const dismissed = localStorage.getItem('installDismissed');
            if (!dismissed) {
                setShowInstallPrompt(true);
            }
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // State persistence effects
    useEffect(() => {
        const storedMissedDays = JSON.parse(localStorage.getItem('ramadanMissedDays') || '[]');
        if (storedMissedDays.length !== ramadanDays) {
            setMissedDays(Array(ramadanDays).fill(false));
        } else {
            setMissedDays(storedMissedDays);
        }
    }, [ramadanDays]);

    useEffect(() => {
        localStorage.setItem('ramadanDaysCount', ramadanDays.toString());
    }, [ramadanDays]);

    useEffect(() => {
        localStorage.setItem('ramadanMissedDays', JSON.stringify(missedDays));
    }, [missedDays]);

    useEffect(() => {
        localStorage.setItem('ramadanMadeUpDays', madeUpDays.toString());
    }, [madeUpDays]);

    useEffect(() => {
        localStorage.setItem('ramadanReminders', JSON.stringify(reminders));
    }, [reminders]);

    // Notification Scheduling Effect
    useEffect(() => {
        // Fix: In a browser environment, setTimeout returns a number, not a NodeJS.Timeout object.
        const timeoutIds: number[] = [];
        if (Notification.permission === 'granted') {
            reminders.forEach(reminder => {
                const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`).getTime();
                const now = new Date().getTime();
                const delay = reminderDateTime - now;

                if (delay > 0) {
                    const timeoutId = setTimeout(() => {
                        new Notification("Rappel Rattrap'Ramadan", {
                            body: reminder.message,
                            icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌙</text></svg>',
                        });
                        // Optional: auto-delete reminder after it fires
                        setReminders(prev => prev.filter(r => r.id !== reminder.id));
                    }, delay);
                    timeoutIds.push(timeoutId);
                }
            });
        }
        // Cleanup timeouts on component unmount or when reminders change
        return () => {
            timeoutIds.forEach(id => clearTimeout(id));
        };
    }, [reminders]);


    const handleSetRamadanDays = (days: number) => {
        setRamadanDays(days);
        const newMissedDays = Array(days).fill(false);
        setMissedDays(newMissedDays);
        localStorage.setItem('ramadanMissedDays', JSON.stringify(newMissedDays));
        if (madeUpDays > 0) {
            setMadeUpDays(0);
            localStorage.setItem('ramadanMadeUpDays', '0');
        }
    };
    
    const handleToggleDay = (index: number) => {
        const newMissedDays = [...missedDays];
        newMissedDays[index] = !newMissedDays[index];
        setMissedDays(newMissedDays);
    };

    const handleReset = () => {
        if (window.confirm('Voulez-vous réinitialiser le calendrier pour un nouveau Ramadan ?')) {
            setMissedDays(Array(ramadanDays).fill(false));
            setMadeUpDays(0);
        }
    };
    
    const handleAddMadeUpDay = () => {
        if (madeUpDays < totalMissed) {
            setMadeUpDays(prev => prev + 1);
        }
    };

    const handleRemoveMadeUpDay = () => {
        if (madeUpDays > 0) {
            setMadeUpDays(prev => prev - 1);
        }
    };
    
    const handleAddReminder = (reminder: Omit<Reminder, 'id'>) => {
        setReminders(prev => [...prev, { ...reminder, id: Date.now() }]);
    };
    
    const handleDeleteReminder = (id: number) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
                setDeferredPrompt(null);
                setShowInstallPrompt(false);
            });
        }
    };

    const handleDismissInstall = () => {
        localStorage.setItem('installDismissed', 'true');
        setShowInstallPrompt(false);
    };

    const totalMissed = useMemo(() => missedDays.filter(d => d).length, [missedDays]);
    const totalRemaining = useMemo(() => Math.max(0, totalMissed - madeUpDays), [totalMissed, madeUpDays]);

    return (
        <div className="min-h-screen overflow-x-hidden">
            {showInstallPrompt && <InstallPrompt onInstall={handleInstall} onDismiss={handleDismissInstall} />}
            
            <Header remainingDays={totalRemaining} year={currentYear} />

            <main className="max-w-7xl mx-auto px-4 py-4">
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

                <div className={activeTab === Tab.Calendar ? '' : 'hidden'}>
                    <CalendarTab 
                        ramadanDays={ramadanDays}
                        onSetRamadanDays={handleSetRamadanDays}
                        missedDays={missedDays}
                        onToggleDay={handleToggleDay}
                        year={currentYear}
                        onReset={handleReset}
                        totalMissed={totalMissed}
                        totalMadeUp={madeUpDays}
                        totalRemaining={totalRemaining}
                    />
                </div>
                <div className={activeTab === Tab.Progress ? '' : 'hidden'}>
                    <ProgressTab 
                       totalMissed={totalMissed}
                       madeUpDays={madeUpDays}
                       onAddMadeUpDay={handleAddMadeUpDay}
                       onRemoveMadeUpDay={handleRemoveMadeUpDay}
                    />
                </div>
                <div className={activeTab === Tab.Info ? '' : 'hidden'}>
                    <InfoTab />
                </div>
                 <div className={activeTab === Tab.Reminders ? '' : 'hidden'}>
                    <RemindersTab
                        reminders={reminders}
                        onAddReminder={handleAddReminder}
                        onDeleteReminder={handleDeleteReminder}
                    />
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default App;