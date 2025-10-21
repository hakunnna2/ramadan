
import React from 'react';
import useCountUp from '../hooks/useCountUp';

interface DashboardTabProps {
    daysToFast: number;
    setDaysToFast: (days: number) => void;
    fastedDates: string[];
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${value}%` }}
        />
    </div>
);

const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
);

const DashboardTab: React.FC<DashboardTabProps> = ({ daysToFast, setDaysToFast, fastedDates }) => {
    const completedDays = fastedDates.length;
    const remainingDays = Math.max(0, daysToFast - completedDays);
    const progress = daysToFast > 0 ? (completedDays / daysToFast) * 100 : 0;
    
    const animatedCompleted = useCountUp(completedDays, 1500);
    const animatedRemaining = useCountUp(remainingDays, 1500);
    const animatedProgress = useCountUp(progress, 1500);

    const handleDaysToFastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0) {
            setDaysToFast(value);
        } else if (e.target.value === '') {
            setDaysToFast(0);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Objectif de rattrapage</h2>
                <div className="flex items-center gap-4">
                    <input
                        type="number"
                        value={daysToFast}
                        onChange={handleDaysToFastChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        aria-label="Nombre de jours à rattraper"
                    />
                     <span className="text-gray-600 dark:text-gray-300">jours</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Progression</h2>
                <div className="flex items-center gap-4 mb-2">
                    <ProgressBar value={animatedProgress} />
                    <span className="font-bold text-purple-600 dark:text-purple-400">{Math.round(animatedProgress)}%</span>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <StatCard label="Jours effectués" value={animatedCompleted} />
                    <StatCard label="Jours restants" value={animatedRemaining} />
                </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-500/30 rounded-2xl p-4 text-center">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    {remainingDays > 0 
                        ? `Continuez vos efforts, il vous reste ${remainingDays} jour${remainingDays > 1 ? 's' : ''} à jeûner !`
                        : "Félicitations, vous avez complété votre rattrapage ! Qu'Allah accepte."
                    }
                </p>
            </div>
        </div>
    );
};

export default DashboardTab;
