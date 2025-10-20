
import React from 'react';

interface InstallPromptProps {
    onInstall: () => void;
    onDismiss: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstall, onDismiss }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 text-center shadow-2xl z-50">
            <p className="mb-2">📱 Installer Rattrap'Ramadan sur votre téléphone</p>
            <div className="flex justify-center gap-4">
                <button 
                    onClick={onInstall}
                    className="bg-white text-purple-600 font-bold py-2 px-6 rounded-lg shadow-md transition-transform hover:scale-105"
                >
                    Installer
                </button>
                <button 
                    onClick={onDismiss}
                    className="bg-transparent text-white border border-white py-2 px-4 rounded-lg transition-opacity hover:opacity-80"
                >
                    Plus tard
                </button>
            </div>
        </div>
    );
};

export default InstallPrompt;
