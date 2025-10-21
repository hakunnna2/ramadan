import React, { useState } from 'react';
import { Reminder } from '../types';
import { format } from 'date-fns';
// FIX: Import French locale directly to resolve module resolution error.
import fr from 'date-fns/locale/fr';

interface RemindersTabProps {
    reminders: Reminder[];
    onAddReminder: (reminder: Omit<Reminder, 'id'>) => void;
    onDeleteReminder: (id: number) => void;
    notificationPermission: NotificationPermission;
    onPermissionChange: (permission: NotificationPermission) => void;
}

const RemindersTab: React.FC<RemindersTabProps> = ({ reminders, onAddReminder, onDeleteReminder, notificationPermission, onPermissionChange }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('08:00');
    const [message, setMessage] = useState('');

    const handleRequestPermission = async () => {
        if (!('Notification' in window)) {
            alert('Ce navigateur ne supporte pas les notifications.');
            return;
        }
        const permission = await Notification.requestPermission();
        onPermissionChange(permission);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time || !message) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        onAddReminder({ date, time, message });
        setDate('');
        setTime('08:00');
        setMessage('');
    };
    
    const sortedReminders = [...reminders].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });

    if (notificationPermission === 'denied') {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🔔 Rappels</h2>
                <p className="text-red-600 font-semibold">Les notifications sont bloquées.</p>
                <p className="text-gray-600 mt-2 text-sm">Pour utiliser cette fonctionnalité, veuillez autoriser les notifications dans les paramètres de votre navigateur.</p>
            </div>
        );
    }
    
    if (notificationPermission === 'default') {
         return (
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🔔 Activer les rappels</h2>
                <p className="text-gray-600 mb-6">Pour recevoir des notifications pour vos rappels, veuillez autoriser cette application à vous envoyer des notifications.</p>
                <button onClick={handleRequestPermission} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
                    Activer les notifications
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🔔 Ajouter un rappel</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <input
                            id="message"
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ex: Jeûner Lundi"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                            <input
                                id="time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                        Ajouter le rappel
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Vos rappels</h2>
                {sortedReminders.length > 0 ? (
                    <ul className="space-y-3">
                        {sortedReminders.map(reminder => (
                            <li key={reminder.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{reminder.message}</p>
                                    <p className="text-sm text-gray-500">
                                        {format(new Date(`${reminder.date}T00:00:00`), 'EEEE d MMMM yyyy', { locale: fr })} à {reminder.time}
                                    </p>
                                </div>
                                <button onClick={() => onDeleteReminder(reminder.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors" aria-label={`Supprimer le rappel: ${reminder.message}`}>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">Vous n'avez aucun rappel pour le moment.</p>
                )}
            </div>
        </div>
    );
};

export default RemindersTab;