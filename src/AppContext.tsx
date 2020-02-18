import { createContext } from "react";

interface AppContextProps {
  Provider: any | React.Provider<any>;
}

export const AppContext: any | React.Context<AppContextProps> = createContext(
  null
);
