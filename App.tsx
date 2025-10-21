import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tab, Reminder } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import CalendarTab from './components/CalendarTab';
import DashboardTab from './components/DashboardTab';
import InfoTab from './components/InfoTab';
import RemindersTab from './components/RemindersTab';
import Footer from './components/Footer';
import SaveIndicator from './components/SaveIndicator';
import InstallPrompt from './components/InstallPrompt';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });

  const [totalDays, setTotalDays] = useState<number>(() => {
    const saved = localStorage.getItem('totalDays');
    return saved ? parseInt(saved, 10) : 30;
  });

  const [fastedDays, setFastedDays] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('fastedDays');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Calendar);
  const [saveIndicatorVisible, setSaveIndicatorVisible] = useState(false);
  const saveTimeoutRef = React.useRef<number | null>(null);
  
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof Notification !== 'undefined') {
        return Notification.permission;
    }
    return 'default';
  });
  const reminderTimeoutsRef = useRef<Map<number, number>>(new Map());


  // PWA Install Prompt state
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      if (!localStorage.getItem('installPromptDismissed')) {
        setShowInstallPrompt(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Effect to schedule notifications and clean up past reminders
  useEffect(() => {
    // Always clear previous timeouts before setting new ones
    reminderTimeoutsRef.current.forEach(clearTimeout);
    reminderTimeoutsRef.current.clear();

    if (notificationPermission !== 'granted') {
        return; // Exit early if permission is not granted
    }
    
    const now = new Date();
    const futureReminders: Reminder[] = [];
    const pastReminders: Reminder[] = [];

    // First, partition reminders into past and future
    reminders.forEach(r => {
        if (new Date(`${r.date}T${r.time}`) < now) {
            pastReminders.push(r);
        } else {
            futureReminders.push(r);
        }
    });

    // If there were past reminders, notify user and update state to clear them
    if (pastReminders.length > 0) {
        console.log(`Found and clearing ${pastReminders.length} missed reminders.`);
        new Notification("Rappels manqués", {
            body: `Vous avez manqué et effacé ${pastReminders.length} rappel(s) passé(s).`,
            icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 192 192%22><rect width=%22192%22 height=%22192%22 rx=%2242%22 fill=%22%239333ea%22/><path d=%22M145.21 85.5A62.25 62.25 0 1 1 77.85 20.25a48.38 48.38 0 0 0 67.36 65.25Z%22 fill=%22white%22/></svg>',
        });
        // This state update will cause the useEffect to run again, but
        // on the next run, there will be no past reminders.
        setReminders(futureReminders); 
        return; // Stop further processing in this render cycle
    }

    // Now, schedule notifications for the remaining future reminders
    console.log(`Scheduling ${futureReminders.length} notifications.`);
    futureReminders.forEach(reminder => {
        const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
        const delay = reminderTime.getTime() - now.getTime();

        if (delay > 0) {
            const timeoutId = window.setTimeout(() => {
                console.log(`Sending notification for reminder: "${reminder.message}" at ${reminder.time}`);
                new Notification("Rappel Rattrap'Ramadan", {
                    body: reminder.message,
                    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 192 192%22><rect width=%22192%22 height=%22192%22 rx=%2242%22 fill=%22%239333ea%22/><path d=%22M145.21 85.5A62.25 62.25 0 1 1 77.85 20.25a48.38 48.38 0 0 0 67.36 65.25Z%22 fill=%22white%22/></svg>',
                });
                // After notifying, remove the reminder from the list
                setReminders(prev => prev.filter(r => r.id !== reminder.id));
            }, delay);
            reminderTimeoutsRef.current.set(reminder.id, timeoutId);
        }
    });

    // Cleanup on unmount or when dependencies change
    return () => {
        console.log('Clearing all scheduled notification timeouts.');
        reminderTimeoutsRef.current.forEach(clearTimeout);
    };
}, [reminders, notificationPermission]);

  const handleInstall = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setShowInstallPrompt(false);
        setInstallPromptEvent(null);
      });
    }
  };

  const handleDismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };
  
  const showSaveIndicator = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setSaveIndicatorVisible(true);
    saveTimeoutRef.current = window.setTimeout(() => {
      setSaveIndicatorVisible(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const isInitialMount = localStorage.getItem('totalDays') === null;
    localStorage.setItem('totalDays', totalDays.toString());
    if (!isInitialMount) {
      showSaveIndicator();
    }
  }, [totalDays, showSaveIndicator]);

  useEffect(() => {
    const isInitialMount = localStorage.getItem('fastedDays') === null;
    localStorage.setItem('fastedDays', JSON.stringify(Array.from(fastedDays)));
    if (!isInitialMount) {
      showSaveIndicator();
    }
  }, [fastedDays, showSaveIndicator]);

  useEffect(() => {
    const isInitialMount = localStorage.getItem('reminders') === null;
    localStorage.setItem('reminders', JSON.stringify(reminders));
    if (!isInitialMount) {
      showSaveIndicator();
    }
  }, [reminders, showSaveIndicator]);

  const handleToggleDay = (day: string) => {
    setFastedDays(prevFastedDays => {
      const newFastedDays = new Set(prevFastedDays);
      if (newFastedDays.has(day)) {
        newFastedDays.delete(day);
      } else {
        newFastedDays.add(day);
      }
      return newFastedDays;
    });
  };
  
  const handleResetProgress = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous vos progrès ? Cette action est irréversible.')) {
      setFastedDays(new Set());
    }
  };

  const handleAddReminder = (reminder: Omit<Reminder, 'id'>) => {
    setReminders(prev => [...prev, { ...reminder, id: Date.now() }]);
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const remainingDays = totalDays - fastedDays.size;

  const renderTabContent = () => {
    switch (activeTab) {
      case Tab.Calendar:
        return <CalendarTab fastedDays={fastedDays} onToggleDay={handleToggleDay} />;
      case Tab.Dashboard:
        return <DashboardTab 
          fastedDays={fastedDays}
          totalDays={totalDays}
          onTotalDaysChange={setTotalDays}
          onReset={handleResetProgress}
        />;
      case Tab.Info:
        return <InfoTab />;
      case Tab.Reminders:
        return <RemindersTab 
          reminders={reminders}
          onAddReminder={handleAddReminder}
          onDeleteReminder={handleDeleteReminder}
          notificationPermission={notificationPermission}
          onPermissionChange={setNotificationPermission}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      <Header 
        remainingDays={remainingDays} 
        year={new Date().getFullYear()} 
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </main>
      <Footer />
      <SaveIndicator isVisible={saveIndicatorVisible} />
      {showInstallPrompt && (
        <InstallPrompt
          onInstall={handleInstall}
          onDismiss={handleDismissInstallPrompt}
        />
      )}
    </div>
  );
};

export default App;
