
import React from 'react';

interface CalendarTabProps {
    ramadanDays: number;
    onSetRamadanDays: (days: number) => void;
    missedDays: boolean[];
    onToggleDay: (index: number) => void;
    year: number;
    onReset: () => void;
    totalMissed: number;
    totalMadeUp: number;
    totalRemaining: number;
}

const CalendarTab: React.FC<CalendarTabProps> = ({
    ramadanDays, onSetRamadanDays, missedDays, onToggleDay, year, onReset, totalMissed, totalMadeUp, totalRemaining
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">📅 Marquer les jours non jeûnés</h2>
                <p className="text-gray-600 mb-4">Cliquez sur les jours où vous n'avez pas jeûné pendant le Ramadan. Ils apparaîtront en rose.</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <span className="text-gray-700 font-medium">Nombre de jours du Ramadan :</span>
                    <div className="flex gap-2">
                        <button 
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${ramadanDays === 29 ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => onSetRamadanDays(29)}
                        >
                            29 jours
                        </button>
                        <button 
                             className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${ramadanDays === 30 ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => onSetRamadanDays(30)}
                        >
                            30 jours
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold bg-purple-100 border-2 border-purple-300 text-purple-700">1</div>
                        <span>Jour jeûné ✅</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold bg-pink-500 border-2 border-pink-600 text-white">1</div>
                        <span>Jour non jeûné ❌</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Calendrier Ramadan {year}</h3>
                    <button className="text-red-500 underline text-sm font-medium" onClick={onReset}>Réinitialiser</button>
                </div>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {Array.from({ length: ramadanDays }).map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => onToggleDay(i)}
                            className={`aspect-square rounded-lg border-2 flex items-center justify-center font-bold text-lg cursor-pointer transition-transform duration-200 active:scale-90 ${
                                missedDays[i] 
                                ? 'bg-pink-500 border-pink-600 text-white shadow-lg shadow-pink-500/30' 
                                : 'bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl p-6 shadow-xl shadow-purple-600/30">
                <h3 className="text-xl font-bold mb-4">📊 Résumé</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <span className="block text-4xl font-bold">{totalMissed}</span>
                        <span className="text-sm opacity-90">Jours manqués</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <span className="block text-4xl font-bold">{totalMadeUp}</span>
                        <span className="text-sm opacity-90">Jours rattrapés</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <span className="block text-4xl font-bold">{totalRemaining}</span>
                        <span className="text-sm opacity-90">Jours restants</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarTab;
