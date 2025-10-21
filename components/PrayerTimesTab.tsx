import React, { useState, useEffect, useCallback } from 'react';

const PRAYER_NAMES: { [key: string]: string } = {
    Fajr: 'Fajr',
    Sunrise: 'Lever du soleil',
    Dhuhr: 'Dhuhr',
    Asr: 'Asr',
    Maghrib: 'Maghrib',
    Isha: 'Isha',
};

const CALCULATION_METHODS = [
    { id: 1, name: 'Muslim World League' },
    { id: 2, name: 'ISNA (Amérique du Nord)' },
    { id: 3, name: 'Egyptian General Authority' },
    { id: 4, name: 'Umm Al-Qura, Makkah' },
    { id: 5, name: 'University of Islamic Sciences, Karachi' },
    { id: 12, name: 'UOIF (France)' },
];

interface PrayerError {
    title: string;
    message: string;
}

const PrayerTimesTab: React.FC = () => {
    const [prayerTimes, setPrayerTimes] = useState<any>(null);
    const [error, setError] = useState<PrayerError | null>(null);
    const [loading, setLoading] = useState(true);
    const [manualCity, setManualCity] = useState(() => localStorage.getItem('manualCity') || '');
    const [manualCountry, setManualCountry] = useState(() => localStorage.getItem('manualCountry') || '');
    const [useManualLocation, setUseManualLocation] = useState(() => !!localStorage.getItem('manualCity'));
    const [method, setMethod] = useState<number>(() => {
        const savedMethod = localStorage.getItem('prayerMethod');
        return savedMethod ? parseInt(savedMethod, 10) : 12; // Default to UOIF (France)
    });
    const [cityInput, setCityInput] = useState(manualCity);
    const [countryInput, setCountryInput] = useState(manualCountry);

    const fetchPrayerTimes = useCallback(async (latitude?: number, longitude?: number) => {
        setLoading(true);
        setError(null);
        setPrayerTimes(null);

        try {
            let url = '';
            const date = new Date();
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

            if (useManualLocation && manualCity && manualCountry) {
                url = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${manualCity}&country=${manualCountry}&method=${method}`;
            } else if (latitude && longitude) {
                url = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
            } else {
                setLoading(false);
                return;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('La connexion au service des horaires de prière a échoué.');
            }
            const data = await response.json();
             if (data.code !== 200) {
                throw new Error(data.data || 'Impossible de trouver les horaires pour le lieu spécifié.');
            }
            setPrayerTimes(data.data);
        } catch (err: any) {
            setError({
                title: 'Erreur de récupération',
                message: err.message || 'Une erreur est survenue. Vérifiez votre connexion et les informations saisies.'
            });
        } finally {
            setLoading(false);
        }
    }, [useManualLocation, manualCity, manualCountry, method]);

    useEffect(() => {
        if (useManualLocation && (manualCity || manualCountry)) {
            fetchPrayerTimes();
        } else if (!useManualLocation) {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
                    },
                    (geoError) => {
                        let title = 'Erreur de géolocalisation';
                        let message = 'Impossible de récupérer votre position. Veuillez entrer votre ville manuellement.';
                        if (geoError.code === 1) { // PERMISSION_DENIED
                            title = 'Géolocalisation refusée';
                            message = 'Vous avez refusé l\'accès à votre position. Veuillez l\'autoriser ou entrer votre ville manuellement ci-dessous.';
                        }
                        setError({ title, message });
                        setUseManualLocation(true);
                        setLoading(false);
                    }
                );
            } else {
                 setError({
                    title: 'Géolocalisation non supportée',
                    message: 'Votre navigateur ne supporte pas la géolocalisation. Veuillez entrer votre ville manuellement.'
                 });
                 setUseManualLocation(true);
                 setLoading(false);
            }
        }
    }, [fetchPrayerTimes, useManualLocation, manualCity, manualCountry]);

    useEffect(() => {
        localStorage.setItem('prayerMethod', method.toString());
    }, [method]);

    const handleManualLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setManualCity(cityInput);
        setManualCountry(countryInput);
        localStorage.setItem('manualCity', cityInput);
        localStorage.setItem('manualCountry', countryInput);
        setUseManualLocation(true);
    };
    
    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMethod(parseInt(e.target.value, 10));
    };

    const relevantPrayers = prayerTimes ? Object.entries(prayerTimes.timings).filter(([key]) => PRAYER_NAMES[key]) : [];

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🕒 Horaires des Prières</h2>
                {loading && <div className="text-center text-gray-500 dark:text-gray-400 py-8">Chargement...</div>}
                {error && (
                    <div className="text-center text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-4 rounded-lg my-4">
                        <p className="font-bold mb-1">{error.title}</p>
                        <p>{error.message}</p>
                    </div>
                )}
                
                {!loading && prayerTimes && (
                    <>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-4 text-sm">
                            Pour {prayerTimes.meta.timezone}
                        </p>
                        <ul className="space-y-2">
                            {relevantPrayers.map(([key, time]) => (
                                <li key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="font-semibold text-gray-700 dark:text-gray-200">{PRAYER_NAMES[key]}</span>
                                    <span className="font-bold text-lg text-purple-600 dark:text-purple-400">{time as string}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Paramètres</h3>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Méthode de calcul</label>
                        <select
                            id="method"
                            value={method}
                            onChange={handleMethodChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            {CALCULATION_METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    <form onSubmit={handleManualLocationSubmit} className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                           Si la géolocalisation est incorrecte, entrez votre ville ici :
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                                <input id="city" type="text" value={cityInput} onChange={e => setCityInput(e.target.value)} placeholder="Ex: Paris" className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays</label>
                                <input id="country" type="text" value={countryInput} onChange={e => setCountryInput(e.target.value)} placeholder="Ex: France" className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            Mettre à jour le lieu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PrayerTimesTab;