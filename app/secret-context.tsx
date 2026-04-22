"use client";

import { createContext, useContext, useState } from "react";

const SecretContext = createContext<any>(null);

export function SecretProvider({ children }: { children: React.ReactNode }) {
  const [secretMode, setSecretMode] = useState(false);

  return (
    <SecretContext.Provider value={{ secretMode, setSecretMode }}>
      {children}
    </SecretContext.Provider>
  );
}

export function useSecret() {
  return useContext(SecretContext);
}
