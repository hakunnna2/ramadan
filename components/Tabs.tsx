
import React, { useState, useEffect, useRef } from 'react';
import { Tab } from '../types';

interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: Tab) => void;
}

const tabItems = [
    { id: Tab.Dashboard, label: 'Tableau de bord', icon: '📊' },
    { id: Tab.Calendar, label: 'Calendrier', icon: '🗓️' },
    { id: Tab.PrayerTimes, label: 'Prières', icon: '🕒' },
    { id: Tab.Info, label: 'Infos', icon: 'ℹ️' },
];

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const navRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const activeTabIndex = tabItems.findIndex(tab => tab.id === activeTab);
        const activeTabElement = tabsRef.current[activeTabIndex];
        
        if (activeTabElement && navRef.current) {
            const navRect = navRef.current.getBoundingClientRect();
            const { offsetLeft, offsetWidth } = activeTabElement;
            
            setIndicatorStyle({
                left: `${offsetLeft}px`,
                width: `${offsetWidth}px`,
            });
        }
    }, [activeTab]);


    return (
        <div ref={navRef} className="relative bg-gray-200 dark:bg-gray-800 rounded-full p-1.5 mb-6 shadow-inner">
            <div 
                className="absolute top-1.5 bottom-1.5 bg-white dark:bg-purple-600 rounded-full shadow-md transition-all duration-300 ease-in-out"
                style={indicatorStyle}
            />
            <nav className="relative z-10 flex justify-around">
                {tabItems.map((tab, index) => (
                    <button
                        key={tab.id}
                        // FIX: Corrected ref callback to prevent returning a value, resolving assignment error.
                        ref={el => { tabsRef.current[index] = el; }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 group inline-flex items-center justify-center py-2.5 px-2 font-bold text-sm transition-colors duration-300 ease-in-out rounded-full ${
                            activeTab === tab.id
                                ? 'text-purple-600 dark:text-white'
                                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                        }`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        <span className="mr-2 h-5 w-5" aria-hidden="true">{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Tabs;
