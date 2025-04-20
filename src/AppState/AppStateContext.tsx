import React, {createContext, useMemo, useState} from 'react';

interface AppStateTypes {
  isLoading: boolean;
  setIsLoading: (T: boolean) => void;
  blockingEnabled: boolean;
  setBlockingEnabled: (T: boolean) => void;
}

export type AppStateProviderProps = {
  children: React.ReactNode;
};

const defaultValues: AppStateTypes = {
  isLoading: false,
  setIsLoading: () => {},
  blockingEnabled: false,
  setBlockingEnabled: () => {},
};

export const AppStatesContext = createContext<AppStateTypes>(defaultValues);

function AppStateProvider({children}: AppStateProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [blockingEnabled, setBlockingEnabled] = useState(false);

  const appContextValue = useMemo(
    () =>
      ({
        isLoading,
        setIsLoading,
        blockingEnabled,
        setBlockingEnabled,
      } as AppStateTypes),
    [blockingEnabled, isLoading],
  );

  return (
    <AppStatesContext.Provider value={appContextValue}>
      {children}
    </AppStatesContext.Provider>
  );
}

export default AppStateProvider;
