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
  fr: {
    code: "fr",
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

  // Function to detect language from URL
  const detectLanguageFromUrl = (urlPath) => {
    if (!urlPath) return defaultLocale;

    const pathSegments = urlPath.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    // Check if first segment matches any configured language code
    const detectedLanguage = Object.keys(languageConfig).find(
      (langCode) => langCode === firstSegment
    );

    return detectedLanguage || defaultLocale;
  };

  useEffect(() => {
    // Use pageUrl if available, otherwise fall back to window.location
    const currentPath = pageUrl?.pathname || window.location.pathname;
    const detectedLang = detectLanguageFromUrl(currentPath);

    if (detectedLang !== currentLanguage) {
      setCurrentLanguage(detectedLang);
    }
  }, [pageUrl, currentLanguage]);

  // Also detect on mount in case pageUrl is not immediately available
  useEffect(() => {
    const currentPath = window.location.pathname;
    const detectedLang = detectLanguageFromUrl(currentPath);
    setCurrentLanguage(detectedLang);
  }, []);

  const switchLanguage = (targetLanguage) => {
    // Use pageUrl if available, otherwise fall back to window.location
    const currentPath = pageUrl?.pathname || window.location.pathname;

    if (!currentPath) return;

    let pathToModify = currentPath;

    // Remove current language prefix if it exists
    Object.keys(languageConfig).forEach((langCode) => {
      if (
        langCode !== defaultLocale &&
        pathToModify.startsWith(`/${langCode}`)
      ) {
        pathToModify = pathToModify.replace(`/${langCode}`, "") || "/";
      }
    });

    // Add target language prefix
    let newPath;
    if (targetLanguage === defaultLocale) {
      newPath = pathToModify;
    } else {
      newPath = `/${targetLanguage}${pathToModify}`;
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
