import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';

interface RemindersTabProps {
    reminders: Reminder[];
    onAddReminder: (reminder: Omit<Reminder, 'id'>) => void;
    onDeleteReminder: (id: number) => void;
}

const RemindersTab: React.FC<RemindersTabProps> = ({ reminders, onAddReminder, onDeleteReminder }) => {
    const [permission, setPermission] = useState(Notification.permission);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('09:00');
    const [message, setMessage] = useState("Il est temps de rattraper un jour de jeûne !");

    useEffect(() => {
        // Set a minimum date for the date picker to today
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setDate(`${yyyy}-${mm}-${dd}`);
    }, []);

    const handleRequestPermission = () => {
        Notification.requestPermission().then(setPermission);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time) {
            alert('Veuillez sélectionner une date et une heure.');
            return;
        }
        onAddReminder({ date, time, message });
        setMessage("Il est temps de rattraper un jour de jeûne !"); // Reset message
    };

    const sortedReminders = [...reminders].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateA - dateB;
    });

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">🔔 Gérer les rappels</h2>
                <p className="text-gray-600 mb-4">Activez les notifications pour recevoir des rappels sur votre appareil.</p>
                {permission === 'default' && (
                    <button onClick={handleRequestPermission} className="bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-amber-600 transition">
                        Activer les notifications
                    </button>
                )}
                {permission === 'denied' && (
                    <p className="text-red-600 bg-red-100 p-3 rounded-lg text-sm">Les notifications sont bloquées. Vous devez les autoriser dans les paramètres de votre navigateur pour utiliser cette fonctionnalité.</p>
                )}
                 {permission === 'granted' && (
                    <p className="text-green-600 bg-green-100 p-3 rounded-lg text-sm">✅ Les notifications sont activées. Vous pouvez maintenant ajouter des rappels.</p>
                )}
            </div>

            {permission === 'granted' && (
                 <div className="bg-white rounded-2xl p-6 shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Ajouter un nouveau rappel</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} className="w-full p-2 border border-gray-300 rounded-lg"/>
                            </div>
                             <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                                <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg"/>
                            </div>
                        </div>
                        <div>
                             <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
                             <input type="text" id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Message du rappel..." className="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-lg shadow-purple-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Ajouter le rappel
                        </button>
                    </form>
                </div>
            )}

            {sortedReminders.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Vos rappels programmés</h3>
                    <ul className="space-y-3">
                        {sortedReminders.map(reminder => (
                            <li key={reminder.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-800">{new Date(reminder.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} à {reminder.time}</p>
                                    <p className="text-sm text-gray-600">{reminder.message}</p>
                                </div>
                                <button onClick={() => onDeleteReminder(reminder.id)} className="text-red-500 hover:text-red-700 font-medium text-2xl">&times;</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RemindersTab;
