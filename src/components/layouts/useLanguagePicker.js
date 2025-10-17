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

export default function useLanguagePicker(pageUrl) {
  // Initialize with detected language from current URL
  const getInitialLanguage = () => {
    // Prioritize window.location.pathname since it contains the actual URL with language prefix
    // Astro's canonicalURL strips the language prefix for SEO purposes
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname
        : pageUrl?.pathname || pageUrl?.toString?.() || "";
    const detectedLang = detectLanguageFromUrl(currentPath);

    // Debug logging
    console.log("Initial language detection:", {
      pageUrl: pageUrl?.pathname || pageUrl?.toString?.(),
      windowPath:
        typeof window !== "undefined" ? window.location.pathname : "SSR",
      currentPath,
      detectedLang,
    });

    return detectedLang;
  };

  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    // Prioritize window.location.pathname since it contains the actual URL with language prefix
    // Astro's canonicalURL strips the language prefix for SEO purposes
    const currentPath = window.location.pathname;
    const detectedLang = detectLanguageFromUrl(currentPath);

    // Debug logging
    console.log("Language detection:", {
      pageUrl: pageUrl?.pathname || pageUrl?.toString?.(),
      windowPath: window.location.pathname,
      currentPath,
      detectedLang,
      currentLanguage,
    });

    setCurrentLanguage(detectedLang);
  }, [pageUrl]);

  const switchLanguage = (targetLanguage) => {
    // Use window.location.pathname since it contains the actual URL with language prefix
    const currentPath = window.location.pathname;

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
