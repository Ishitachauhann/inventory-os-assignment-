import { createContext, useCallback, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [flash, setFlash] = useState(null);

  const showSuccess = useCallback((message) => {
    setFlash({ type: 'success', message });
    setTimeout(() => setFlash(null), 4000);
  }, []);

  const showError = useCallback((message) => {
    setFlash({ type: 'error', message });
    setTimeout(() => setFlash(null), 6000);
  }, []);

  const clearFlash = useCallback(() => setFlash(null), []);

  return (
    <AppContext.Provider value={{ flash, showSuccess, showError, clearFlash }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
