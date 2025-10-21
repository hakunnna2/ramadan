
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import DashboardTab from './components/DashboardTab';
import CalendarTab from './components/CalendarTab';
import PrayerTimesTab from './components/PrayerTimesTab';
import InfoTab from './components/InfoTab';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';
import SaveIndicator from './components/SaveIndicator';
import { Tab } from './types';

// BeforeInstallPromptEvent is not in standard TS libs yet
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
    const [daysToFast, setDaysToFast] = useState<number>(() => {
        const saved = localStorage.getItem('daysToFast');
        return saved ? JSON.parse(saved) : 0;
    });
    const [fastedDates, setFastedDates] = useState<string[]>(() => {
        const saved = localStorage.getItem('fastedDates');
        return saved ? JSON.parse(saved) : [];
    });
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
    const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // PWA Install Prompt
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPromptEvent(e as BeforeInstallPromptEvent);
            setShowInstallPrompt(true);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstall = () => {
        if (!installPromptEvent) return;
        installPromptEvent.prompt();
        installPromptEvent.userChoice.then(() => {
            setInstallPromptEvent(null);
            setShowInstallPrompt(false);
        });
    };

    const handleDismissInstall = () => {
        setShowInstallPrompt(false);
    };

    // Save state to localStorage and show indicator
    const useDebouncedSave = (value: any, key: string) => {
        useEffect(() => {
            // Don't show save indicator on initial load
            // FIX: Imported useRef to resolve 'Cannot find name 'useRef''.
            const initialLoad = useRef(true);
            
            if (initialLoad.current) {
                initialLoad.current = false;
                return;
            }

            setIsSaving(true);
            const handler = setTimeout(() => {
                localStorage.setItem(key, JSON.stringify(value));
                setIsSaving(false);
            }, 1000);

            return () => {
                clearTimeout(handler);
            };
        }, [value, key]);
    };

    useDebouncedSave(daysToFast, 'daysToFast');
    useDebouncedSave(fastedDates, 'fastedDates');
    
    const [showSaveIndicator, setShowSaveIndicator] = useState(false);
    // FIX: Imported useRef to resolve 'Cannot find name 'useRef''.
    const firstSaveDone = useRef(false);

    useEffect(() => {
        // FIX: Changed NodeJS.Timeout to ReturnType<typeof setTimeout> for browser compatibility.
        let timer: ReturnType<typeof setTimeout>;
        if (isSaving) {
            firstSaveDone.current = true;
            setShowSaveIndicator(true);
        } else if (firstSaveDone.current) {
            // Only hide after the first save has completed
            timer = setTimeout(() => setShowSaveIndicator(false), 3000);
        }
        return () => clearTimeout(timer);
    }, [isSaving]);


    const handleDateToggle = useCallback((date: string) => {
        setFastedDates(prevDates =>
            prevDates.includes(date)
                ? prevDates.filter(d => d !== date)
                : [...prevDates, date]
        );
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case Tab.Dashboard:
                return <DashboardTab daysToFast={daysToFast} setDaysToFast={setDaysToFast} fastedDates={fastedDates} />;
            case Tab.Calendar:
                return <CalendarTab fastedDates={fastedDates} onDateToggle={handleDateToggle} />;
            case Tab.PrayerTimes:
                return <PrayerTimesTab />;
            case Tab.Info:
                return <InfoTab />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
            <Header daysToFast={daysToFast} completedDays={fastedDates.length} />
            <main className="container mx-auto px-4 max-w-2xl pb-6">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                {renderTabContent()}
            </main>
            <Footer />
            {showInstallPrompt && (
                <InstallPrompt onInstall={handleInstall} onDismiss={handleDismissInstall} />
            )}
            <SaveIndicator isVisible={showSaveIndicator} />
        </div>
    );
};

export default App;
