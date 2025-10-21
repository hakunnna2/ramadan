
import React from 'react';

interface HeaderProps {
    daysToFast: number;
    completedDays: number;
}

const Header: React.FC<HeaderProps> = ({ daysToFast, completedDays }) => {
    const remainingDays = Math.max(0, daysToFast - completedDays);

    return (
        <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-b-3xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-center">Rattrap'Ramadan</h1>
            <p className="text-center text-purple-200 mt-1">Suivez votre rattrapage de jeûne</p>
            <div className="mt-6 flex justify-around text-center">
                <div>
                    <span className="block text-2xl font-bold">{daysToFast}</span>
                    <span className="text-xs text-purple-200 uppercase">À rattraper</span>
                </div>
                <div>
                    <span className="block text-2xl font-bold">{completedDays}</span>
                    <span className="text-xs text-purple-200 uppercase">Effectués</span>
                </div>
                <div>
                    <span className="block text-2xl font-bold text-yellow-300">{remainingDays}</span>
                    <span className="text-xs text-purple-200 uppercase">Restants</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
