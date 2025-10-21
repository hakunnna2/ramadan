import React, { useState } from 'react';
// FIX: Standardized all date-fns imports to use named exports from the main package and the locale subpackage.
// This resolves the module resolution error that was causing the React #321 crash.
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths
} from 'date-fns';
// FIX: Corrected import for the 'fr' locale to resolve module resolution error. This should also fix the other related date-fns import errors.
import fr from 'date-fns/locale/fr';

interface CalendarTabProps {
    fastedDates: string[];
    onDateToggle: (date: string) => void;
}

const CalendarTab: React.FC<CalendarTabProps> = ({ fastedDates, onDateToggle }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                </h2>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
        return (
            <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {days.map(day => <div key={day}>{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="grid grid-cols-7">
                {days.map((day, i) => {
                    const isoDate = format(day, 'yyyy-MM-dd');
                    const isSelected = fastedDates.includes(isoDate);
                    
                    return (
                        <div
                            key={i}
                            className="flex justify-center p-1"
                        >
                            <button
                                onClick={() => onDateToggle(isoDate)}
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ease-in-out text-sm ${
                                    !isSameMonth(day, monthStart)
                                        ? 'text-gray-300 dark:text-gray-600'
                                        : isSelected
                                        ? 'bg-purple-600 text-white font-bold shadow-md transform scale-105'
                                        : isToday(day)
                                        ? 'text-pink-600 font-bold border-2 border-pink-500'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                {format(day, 'd')}
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4 text-sm">Cliquez sur une date pour marquer un jour comme jeûné.</p>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
             <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-600"></span>
                    <span className="text-gray-600 dark:text-gray-300">Jour jeûné</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-pink-500"></span>
                    <span className="text-gray-600 dark:text-gray-300">Aujourd'hui</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarTab;