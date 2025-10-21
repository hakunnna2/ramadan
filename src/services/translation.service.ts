import { Injectable, computed, inject } from '@angular/core';
import { StateService } from './state.service';

// This is a union of all translation keys used in the app.
// It's used for type safety.
export type TranslationKey =
  | 'dashboard'
  | 'calendar'
  | 'info'
  | 'completed'
  | 'remaining'
  | 'set_goal'
  | 'monthly_summary'
  | 'share_title'
  | 'share_text'
  | 'install'
  | 'install_app'
  | 'install_app_description'
  | 'about_app_title'
  | 'about_app_content'
  | 'share_the_app'
  | 'share_app_description'
  | 'share'
  | 'day_fasted'
  | 'day_today'
  | 'prev_month'
  | 'next_month'
  // FIX: Add missing translation keys for prayer times component.
  | 'prayer_times_for'
  | 'select_city'
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha';


const fr = {
  dashboard: 'Tableau de bord',
  calendar: 'Calendrier',
  info: 'Infos',
  completed: 'Complétés',
  remaining: 'Restants',
  set_goal: 'Objectif',
  monthly_summary: '{fasted} sur {total} jours jeûnés ce mois-ci',
  share_title: 'Rattrap\' Ramadan - Suivi de jeûne',
  share_text: 'Suis tes jours de jeûne à rattraper pour le Ramadan avec cette application simple !',
  install: 'Installer',
  install_app: 'Installer l\'application',
  install_app_description: 'Pour un accès rapide, ajoutez-la à votre écran d\'accueil.',
  about_app_title: 'À propos de l\'application',
  about_app_content: "Rattrap'Ramadan est votre compagnon personnel pour vous aider à suivre les jours de jeûne de Ramadan à rattraper avec facilité et sérénité. Nous avons conçu cette application avec une interface épurée et motivante pour vous accompagner dans votre cheminement spirituel. Gardez vos progrès organisés et restez concentrée sur vos objectifs.",
  share_the_app: 'Partager l\'application',
  share_app_description: 'Aidez vos sœurs et maman à suivre leur jeûne.',
  share: 'Partager',
  day_fasted: 'Jeûné',
  day_today: 'Aujourd\'hui',
  prev_month: 'Mois précédent',
  next_month: 'Mois suivant',
  // FIX: Add missing translations for prayer times component.
  prayer_times_for: 'Horaires de prière pour',
  select_city: 'Sélectionner une ville',
  fajr: 'Fajr',
  sunrise: 'Lever du soleil',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

type Translations = typeof fr;

const translations: Record<string, Translations> = { fr };

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private stateService = inject(StateService);

  private currentLanguage = this.stateService.language;
  
  private currentTranslations = computed(() => translations[this.currentLanguage()] || fr);

  // The 't' property is a signal that holds the translation function.
  // This allows components to react to language changes automatically if multi-language support is added.
  public t = computed(() => {
    // This is the translation function
    return (key: TranslationKey, context?: Record<string, string | number>): string => {
      let translation = this.currentTranslations()[key as keyof Translations] || key;
      if (context) {
        for (const k in context) {
          if (Object.prototype.hasOwnProperty.call(context, k)) {
            translation = translation.replace(`{${k}}`, String(context[k]));
          }
        }
      }
      return translation;
    };
  });
}
