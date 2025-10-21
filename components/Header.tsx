import React from 'react';

interface HeaderProps {
    remainingDays: number;
    year: number;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ remainingDays, year, theme, onToggleTheme }) => {
    return (
        <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 shadow-lg">
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
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-4xl sm:text-5xl font-bold">{remainingDays}</div>
                        <div className="text-sm opacity-90">jours restants</div>
                    </div>
                    <button onClick={onToggleTheme} className="p-2 rounded-full text-white/80 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white" aria-label="Changer de thème">
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
