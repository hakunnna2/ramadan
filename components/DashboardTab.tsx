import React, { useState, useEffect, useMemo } from 'react';
// FIX: Removed parseISO as it was not found in date-fns import.
import { differenceInCalendarDays } from 'date-fns';

interface DashboardTabProps {
    fastedDays: Set<string>;
    totalDays: number;
    onTotalDaysChange: (days: number) => void;
    onReset: () => void;
}

const StatCard: React.FC<{ label: string, value: string | number, icon: string }> = ({ label, value, icon }) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
        </div>
    </div>
);

const DashboardTab: React.FC<DashboardTabProps> = ({ fastedDays, totalDays, onTotalDaysChange, onReset }) => {
    const [localTotalDays, setLocalTotalDays] = useState(totalDays.toString());

    useEffect(() => {
        setLocalTotalDays(totalDays.toString());
    }, [totalDays]);

    const streaks = useMemo(() => {
        if (fastedDays.size === 0) return { current: 0, longest: 0 };

        // FIX: Replaced parseISO with native Date logic to correctly parse 'yyyy-MM-dd' strings as local dates.
        const sortedDays = Array.from(fastedDays).map(d => {
            const parts = d.split('-').map(Number);
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }).sort((a, b) => a.getTime() - b.getTime());
        
        let currentStreak = 1;
        let longestStreak = 1;

        for (let i = 1; i < sortedDays.length; i++) {
            if (differenceInCalendarDays(sortedDays[i], sortedDays[i - 1]) === 1) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
        }
        
        const lastDay = sortedDays[sortedDays.length - 1];
        if (differenceInCalendarDays(new Date(), lastDay) > 1) {
             currentStreak = 0;
        }

        return { current: currentStreak, longest: longestStreak };
    }, [fastedDays]);

    const fastedCount = fastedDays.size;
    const percentage = totalDays > 0 ? Math.round((fastedCount / totalDays) * 100) : 0;
    const remainingDays = totalDays - fastedCount;

    const handleTotalDaysSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(localTotalDays, 10);
        if (!isNaN(num) && num > 0) {
            onTotalDaysChange(num);
        } else {
            setLocalTotalDays(totalDays.toString());
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Votre progression</h2>
                <div className="relative w-48 h-48 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-gray-200 dark:text-gray-700"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="currentColor" strokeWidth="3.8"
                        />
                        <path
                            className="text-purple-600"
                            strokeDasharray={`${percentage}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{percentage}%</span>
                        <span className="text-gray-500 dark:text-gray-400">{fastedCount} / {totalDays} jours</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    <StatCard label="Jours rattrapés" value={fastedCount} icon="✅" />
                    <StatCard label="Jours restants" value={remainingDays} icon="⏳" />
                    <StatCard label="Objectif total" value={totalDays} icon="🎯" />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Statistiques de série</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <StatCard label="Série actuelle" value={`${streaks.current} jours`} icon="🔥" />
                    <StatCard label="Meilleure série" value={`${streaks.longest} jours`} icon="🏆" />
                 </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Modifier l'objectif</h3>
                 <form onSubmit={handleTotalDaysSubmit} className="flex items-center gap-4">
                     <label htmlFor="total-days-input" className="sr-only">Nombre total de jours à rattraper</label>
                     <input
                         id="total-days-input" type="number" value={localTotalDays}
                         onChange={(e) => setLocalTotalDays(e.target.value)}
                         className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                         min="1"
                     />
                     <button type="submit" className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                         Mettre à jour
                     </button>
                 </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Réinitialisation</h3>
                 <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Attention, cette action est irréversible et supprimera tous les jours que vous avez marqués.</p>
                 <button 
                     onClick={onReset}
                     className="w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors"
                 >
                     Réinitialiser mes progrès
                 </button>
            </div>
        </div>
    );
};

export default DashboardTab;