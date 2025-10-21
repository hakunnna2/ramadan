
import React, { useState, useEffect } from 'react';

interface ProgressTabProps {
    fastedCount: number;
    totalDays: number;
    onTotalDaysChange: (days: number) => void;
    onReset: () => void;
}

const ProgressTab: React.FC<ProgressTabProps> = ({ fastedCount, totalDays, onTotalDaysChange, onReset }) => {
    const [localTotalDays, setLocalTotalDays] = useState(totalDays.toString());

    useEffect(() => {
        setLocalTotalDays(totalDays.toString());
    }, [totalDays]);

    const percentage = totalDays > 0 ? Math.round((fastedCount / totalDays) * 100) : 0;

    const handleTotalDaysSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(localTotalDays, 10);
        if (!isNaN(num) && num > 0) {
            onTotalDaysChange(num);
        } else {
            setLocalTotalDays(totalDays.toString()); // Reset to valid state if input is invalid
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Votre progression</h2>
                <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-gray-200"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.8"
                        />
                        <path
                            className="text-purple-600"
                            strokeDasharray={`${percentage}, 100`}
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.8"
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-800">{percentage}%</span>
                        <span className="text-gray-500">{fastedCount} / {totalDays} jours</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Jours à rattraper</h3>
                 <form onSubmit={handleTotalDaysSubmit} className="flex items-center gap-4">
                     <label htmlFor="total-days-input" className="sr-only">Nombre total de jours à rattraper</label>
                     <input
                         id="total-days-input"
                         type="number"
                         value={localTotalDays}
                         onChange={(e) => setLocalTotalDays(e.target.value)}
                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                         min="1"
                     />
                     <button type="submit" className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                         Mettre à jour
                     </button>
                 </form>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Réinitialisation</h3>
                 <p className="text-gray-600 text-sm mb-4">Attention, cette action est irréversible et supprimera tous les jours que vous avez marqués.</p>
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

export default ProgressTab;
