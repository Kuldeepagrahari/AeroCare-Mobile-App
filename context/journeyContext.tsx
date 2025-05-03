import React, { createContext, useContext, useState } from "react";

type JourneyContextType = {
  isJourneyStarted: boolean;
  startJourney: () => void;
  journey_end: () => void;
};

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);

  const startJourney = () => {
    setIsJourneyStarted(true);
  };
  const journey_end = () => {
    setIsJourneyStarted(false);
  };

  return (
    <JourneyContext.Provider value={{ isJourneyStarted, journey_end, startJourney }}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error("useJourney must be used within a JourneyProvider");
  }
  return context;
};
