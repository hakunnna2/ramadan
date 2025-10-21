import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 mt-12 py-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">Rattrap'Ramadan - Qu'Allah accepte votre jeûne 🤲</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">by hakuna matata</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">Vos données sont sauvegardées localement sur votre appareil</p>
        </footer>
    );
};

export default Footer;
