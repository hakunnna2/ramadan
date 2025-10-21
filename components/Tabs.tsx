
import React from 'react';
import { Tab } from '../types';

interface TabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const tabConfig = [
    { id: Tab.Calendar, label: 'Calendrier', icon: '📅' },
    { id: Tab.Progress, label: 'Progrès', icon: '📊' },
    { id: Tab.Reminders, label: 'Rappels', icon: '🔔' },
    { id: Tab.Info, label: 'Infos', icon: 'ℹ️' },
];

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-2 flex justify-around gap-1 sm:gap-2">
            {tabConfig.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 text-center py-3 px-2 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
                        ${activeTab === tab.id
                            ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                            : 'text-gray-600 hover:bg-purple-100'
                        }`}
                >
                    <span className="mr-2 hidden sm:inline-block">{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
