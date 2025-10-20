import React from 'react';

interface SaveIndicatorProps {
    isVisible: boolean;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ isVisible }) => {
    return (
        <div 
            className={`fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-lg transition-all duration-300 ease-in-out z-50 ${
                isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <span role="img" aria-label="check mark">✓</span> Progrès sauvegardé
        </div>
    );
};

export default SaveIndicator;
