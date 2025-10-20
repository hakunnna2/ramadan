
import React from 'react';

const InfoItem: React.FC<{
    title: string;
    content: string;
    borderColor: string;
}> = ({ title, content, borderColor }) => (
    <div className={`border-l-4 ${borderColor} pl-4 mb-4`}>
        <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm">{content}</p>
    </div>
);

const TipItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <li className="flex gap-3 items-start text-gray-700">
        <span className="text-purple-600 font-bold mt-1">•</span>
        <span>{children}</span>
    </li>
);

const InfoTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🕌 Rappels islamiques</h2>
                <InfoItem 
                    title="Obligation du rattrapage"
                    content="Le rattrapage des jours de jeûne manqués est obligatoire (fardh) et doit être effectué avant le Ramadan suivant."
                    borderColor="border-purple-500"
                />
                 <InfoItem 
                    title="Flexibilité du rattrapage"
                    content="Vous pouvez rattraper les jours manqués de manière consécutive ou espacée, selon vos capacités."
                    borderColor="border-pink-500"
                />
                 <InfoItem 
                    title="Délai de rattrapage"
                    content="Il est préférable de rattraper au plus tôt, mais vous avez jusqu'au Ramadan suivant pour compléter votre rattrapage."
                    borderColor="border-amber-500"
                />
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">💡 Conseils pratiques</h2>
                <ul className="space-y-3">
                   <TipItem>Planifiez votre rattrapage : choisissez des jours où vous êtes disponible et en forme</TipItem>
                   <TipItem>Les lundis et jeudis sont des jours recommandés pour jeûner</TipItem>
                   <TipItem>Restez hydraté(e) entre iftar et suhur</TipItem>
                   <TipItem>Privilégiez une alimentation équilibrée pour éviter la fatigue</TipItem>
                   <TipItem>N'hésitez pas à jeûner en hiver quand les jours sont plus courts</TipItem>
                </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2">ℹ️ Note importante</h3>
                <p className="text-blue-700 text-sm">Cette application est un outil d'aide au suivi personnel. Pour toute question religieuse spécifique, veuillez consulter un savant ou une personne qualifiée en sciences islamiques.</p>
            </div>
        </div>
    );
};

export default InfoTab;
