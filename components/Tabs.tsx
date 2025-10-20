import React from 'react';
import { Tab } from '../types';

interface TabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const TabButton: React.FC<{
    tabId: Tab;
    activeTab: Tab;
    onClick: (tab: Tab) => void;
    icon: string;
    label: string;
}> = ({ tabId, activeTab, onClick, icon, label }) => {
    const isActive = activeTab === tabId;
    return (
        <button
            className={`flex-1 p-3 border-none rounded-md text-sm sm:text-base cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onClick(tabId)}
        >
            <span>{icon}</span> {label}
        </button>
    );
};


const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="bg-white rounded-xl p-1 shadow-md flex gap-1 sm:gap-2 mb-6">
            <TabButton tabId={Tab.Calendar} activeTab={activeTab} onClick={onTabChange} icon="📅" label="Calendrier" />
            <TabButton tabId={Tab.Progress} activeTab={activeTab} onClick={onTabChange} icon="📊" label="Progression" />
            <TabButton tabId={Tab.Reminders} activeTab={activeTab} onClick={onTabChange} icon="🔔" label="Rappels" />
            <TabButton tabId={Tab.Info} activeTab={activeTab} onClick={onTabChange} icon="ℹ️" label="Conseils" />
        </div>
    );
};

export default Tabs;
