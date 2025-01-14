import{ createContext, useContext, useState, ReactNode } from 'react';


// ���� ���� Context Ÿ�� ����
interface GameContextType {
  completedSteps: number;
  completeStep: () => void;
  canAccessStep: (step: number) => boolean;
}

// Context ����
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider ������Ʈ ����
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [completedSteps, setCompletedSteps] = useState(0);

  const completeStep = () => {
    setCompletedSteps((prev) => prev + 1);
  };

  const canAccessStep = (step: number) => {
    return step <= completedSteps + 1; // ���� �ܰ踸 ���� ����
  };

  return (
    <GameContext.Provider value={{ completedSteps, completeStep, canAccessStep }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom Hook
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
