
import React from 'react';

interface ProgressTabProps {
    totalMissed: number;
    madeUpDays: number;
    onAddMadeUpDay: () => void;
    onRemoveMadeUpDay: () => void;
}

const ProgressTab: React.FC<ProgressTabProps> = ({ totalMissed, madeUpDays, onAddMadeUpDay, onRemoveMadeUpDay }) => {
    
    const progressPercent = totalMissed > 0 ? Math.round((madeUpDays / totalMissed) * 100) : 0;

    const getMotivationText = () => {
        const remaining = Math.max(0, totalMissed - madeUpDays);
        if (totalMissed === 0) {
            return "Commencez par marquer les jours manqués dans l'onglet Calendrier. 📅";
        }
        if (remaining === 0) {
            return "🎉 MashaAllah ! Vous avez rattrapé tous vos jours de jeûne. Qu'Allah accepte vos efforts ! 🤲";
        }
        return `Il vous reste ${remaining} jour${remaining > 1 ? 's' : ''} à rattraper. Courage ! Chaque jour rattrapé est une victoire. 🌙`;
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">✅ Rattrapage en cours</h2>
                <p className="text-gray-600 mb-6">Cliquez sur le bouton ci-dessous chaque fois que vous rattrapez un jour de jeûne.</p>

                <div className="mb-6">
                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                        <span>Progression</span>
                        <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${progressPercent}%` }}>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-600/30 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                        onClick={onAddMadeUpDay}
                        disabled={madeUpDays >= totalMissed}
                    >
                        ✓ J'ai rattrapé 1 jour
                    </button>
                    <button 
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onRemoveMadeUpDay}
                        disabled={madeUpDays === 0}
                    >
                        Annuler
                    </button>
                </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-300 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-2">💪 Message d'encouragement</h3>
                <p className="text-amber-700">{getMotivationText()}</p>
            </div>
        </div>
    );
};

export default ProgressTab;
