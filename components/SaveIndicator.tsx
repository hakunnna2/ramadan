import React from 'react';

interface SaveIndicatorProps {
    isVisible: boolean;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ isVisible }) => {
    return (
        <div 
            className={`fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white px-6 py-3 text-base rounded-full shadow-lg transition-all duration-500 ease-bounce z-50 ${
                isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
        >
            <span role="img" aria-label="check mark" className="text-lg">✓</span>
            Progrès sauvegardé
        </div>
    );
};

export default SaveIndicator;