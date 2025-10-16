import { useEffect, useState } from "react";

// Language configuration - easily extensible
const defaultLocale = "en";
const languageConfig = {
  en: {
    code: "en",
    label: "English",
    flag: "🇺🇸",
    shortLabel: "EN",
  },
  "fr-FR": {
    code: "fr-FR",
    label: "Français",
    flag: "🇫🇷",
    shortLabel: "FR",
  },
  // Add more languages here as needed:
  // "de-DE": {
  //   code: "de-DE",
  //   label: "Deutsch",
  //   flag: "🇩🇪",
  //   shortLabel: "DE"
  // }
};

export default function useLanguagePicker(pageUrl) {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLocale);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    if (pageUrl?.pathname) {
      const pathSegments = pageUrl.pathname.split("/").filter(Boolean);
      const firstSegment = pathSegments[0];

      // Check if first segment matches any configured language code
      const detectedLanguage = Object.keys(languageConfig).find(
        (langCode) => langCode === firstSegment
      );

      if (detectedLanguage) {
        setCurrentLanguage(detectedLanguage);
      } else {
        setCurrentLanguage(defaultLocale);
      }
    }
  }, [pageUrl]);

  const switchLanguage = (targetLanguage) => {
    if (!pageUrl?.pathname) return;

    let currentPath = pageUrl.pathname;

    // Remove current language prefix if it exists
    Object.keys(languageConfig).forEach((langCode) => {
      if (
        langCode !== defaultLocale &&
        currentPath.startsWith(`/${langCode}`)
      ) {
        currentPath = currentPath.replace(`/${langCode}`, "") || "/";
      }
    });

    // Add target language prefix
    let newPath;
    if (targetLanguage === defaultLocale) {
      newPath = currentPath;
    } else {
      newPath = `/${targetLanguage}${currentPath}`;
    }

    window.location.href = newPath;
  };

  const toggleLanguageDropdown = (e) => {
    if (e) e.preventDefault();
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageSelect = (language) => {
    setIsLanguageDropdownOpen(false);
    switchLanguage(language);
  };

  return {
    currentLanguage,
    isLanguageDropdownOpen,
    toggleLanguageDropdown,
    handleLanguageSelect,
    languageConfig: languageConfig,
    availableLanguages: Object.keys(languageConfig),
  };
}
