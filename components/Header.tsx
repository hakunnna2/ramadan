
import React from 'react';

interface HeaderProps {
    remainingDays: number;
    year: number;
}

const Header: React.FC<HeaderProps> = ({ remainingDays, year }) => {
    return (
        <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 sm:p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                    </svg>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Rattrap'Ramadan</h1>
                        <p className="text-sm opacity-90">Suivi de jeûne - Ramadan {year}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-4xl sm:text-5xl font-bold">{remainingDays}</div>
                    <div className="text-sm opacity-90">jours restants</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
