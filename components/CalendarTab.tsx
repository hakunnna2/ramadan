import React, { useState } from 'react';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    // FIX: Removed subMonths, startOfMonth, and startOfWeek as they were not found in date-fns import.
} from 'date-fns';
import fr from 'date-fns/locale/fr';

interface CalendarTabProps {
    fastedDays: Set<string>;
    onToggleDay: (day: string) => void;
}

const CalendarTab: React.FC<CalendarTabProps> = ({ fastedDays, onToggleDay }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4 px-2">
            <button 
                // FIX: Replaced subMonths with addMonths(..., -1) as subMonths was not found in date-fns import.
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Mois précédent"
            >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </h3>
            <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Mois suivant"
            >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        </div>
    );

    const renderDays = () => {
        const daysOfWeek = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
        return (
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-500 dark:text-gray-400 text-sm">
                {daysOfWeek.map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        // FIX: Replaced startOfMonth with native Date logic as it was not found in date-fns import.
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = endOfMonth(monthStart);
        // FIX: Replaced startOfWeek with native Date logic as it was not found in date-fns import.
        // The logic calculates the start of the week assuming Sunday (day 0) is the first day.
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="grid grid-cols-7 gap-1 mt-2">
                {days.map(day => {
                    const dateString = format(day, 'yyyy-MM-dd');
                    const isFasted = fastedDays.has(dateString);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isTodaysDate = isToday(day);

                    return (
                        <button
                            key={day.toString()}
                            disabled={!isCurrentMonth}
                            className={`flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 mx-auto rounded-full cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                                ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-200'}
                                ${isFasted ? 'bg-purple-600 text-white font-bold shadow-md' : isCurrentMonth ? 'hover:bg-purple-100 dark:hover:bg-gray-700' : ''}
                                ${isTodaysDate && !isFasted && isCurrentMonth ? 'border-2 border-pink-500' : ''}
                            `}
                            onClick={() => onToggleDay(dateString)}
                        >
                            <span className="text-base">{format(day, 'd')}</span>
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-md">
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4 text-sm">Sélectionnez les jours que vous avez jeûnés. Vous avez rattrapé <strong className="text-purple-600 dark:text-purple-400">{fastedDays.size}</strong> jour(s).</p>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default CalendarTab;