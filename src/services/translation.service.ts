// FIX: Create content for missing translation service file.
import { Injectable, computed, inject } from '@angular/core';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  stateService = inject(StateService);

  private currentLang = computed(() => this.stateService.language() || 'fr');
  
  private translations = {
    fr: {
      // General
      dashboard: 'Tableau de bord',
      calendar: 'Calendrier',
      info: 'Infos',
      // Dashboard
      fasting_goal: 'Objectif de jeûne',
      days: 'jours',
      completed: 'Complétés',
      remaining: 'Restants',
      well_done: 'Bravo !',
      goal_achieved: 'Objectif atteint ! Vous avez rattrapé tous vos jours.',
      // Calendar
      mark_as_fasted: 'Jour jeûné',
      unmark_as_fasted: 'Démarquer',
      // Info
      about_app: 'À propos de l\'application',
      app_description: 'Cette application vous aide à suivre les jours de jeûne que vous devez rattraper pour le Ramadan.',
      share_app: 'Partager l\'application',
      install_app: 'Installer l\'application',
      install_app_description: 'Ajoutez cette application à votre écran d\'accueil pour un accès facile.',
      install: 'Installer',
      share_title: 'Rattrap Ramadan - Suivi de jeûne',
      share_text: 'Suivez facilement vos jours de jeûne à rattraper avec cette application !',
      // Prayer Times
      prayer_times_for: 'Horaires de prière pour',
      select_city: 'Sélectionner une ville',
      fajr: 'Fajr',
      sunrise: 'Chourok',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
    },
    ar: {
      // General
      dashboard: 'لوحة التحكم',
      calendar: 'التقويم',
      info: 'معلومات',
      // Dashboard
      fasting_goal: 'أيام القضاء',
      days: 'أيام',
      completed: 'أيام القضاء',
      remaining: 'الأيام المتبقية',
      well_done: 'أحسنت!',
      goal_achieved: 'لقد أتممت صيام كل الأيام!',
      // Calendar
      mark_as_fasted: 'تم الصيام',
      unmark_as_fasted: 'إلغاء',
      // Info
      about_app: 'حول التطبيق',
      app_description: 'هذا التطبيق يساعدك على تتبع أيام الصيام التي يجب عليك قضاؤها من شهر رمضان.',
      share_app: 'مشاركة التطبيق',
      install_app: 'تثبيت التطبيق',
      install_app_description: 'أضف هذا التطبيق إلى شاشتك الرئيسية لسهولة الوصول إليه.',
      install: 'تثبيت',
      share_title: 'قضاء رمضان - متابعة الصيام',
      share_text: 'تابع أيام الصيام التي عليك قضاؤها بسهولة مع هذا التطبيق!',
      // Prayer Times
      prayer_times_for: 'مواقيت الصلاة لمدينة',
      select_city: 'اختر مدينة',
      fajr: 'الفجر',
      sunrise: 'الشروق',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء',
    }
  };

  t = computed(() => (key: keyof typeof this.translations['fr']) => {
    const lang = this.currentLang();
    return this.translations[lang][key] || key;
  });
}
