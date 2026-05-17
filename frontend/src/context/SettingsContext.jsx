import { createContext, useState, useContext } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [autoSuggestTags, setAutoSuggestTags] = useState(
    () => localStorage.getItem('autoSuggestTags') === 'true'
  );

  const toggleAutoSuggestTags = () => {
    setAutoSuggestTags(prev => {
      const next = !prev;
      localStorage.setItem('autoSuggestTags', String(next));
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ autoSuggestTags, toggleAutoSuggestTags }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
