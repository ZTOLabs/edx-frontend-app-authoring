import { useState } from 'react';

type SwitchLanguage = 'en' | 'vi';

const languageOptions = [
  {
    value: 'en' as const,
    label: 'EN',
  },
  {
    value: 'vi' as const,
    label: 'VI',
  },
] as const;

export const useLanguageSwitch = () => {
  const [language, setLanguage] = useState<SwitchLanguage>('vi');
  const toggleLanguage = (newLanguage: SwitchLanguage) => {
    setLanguage(newLanguage);
    // i18n.changeLanguage(newLanguage);
  };

  return {
    language,
    languageOptions,
    toggleLanguage,
  };
};
