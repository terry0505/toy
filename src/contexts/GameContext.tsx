import{ createContext, useContext, useState, ReactNode } from 'react';


// 게임 상태 Context 타입 정의
interface GameContextType {
  completedSteps: number;
  completeStep: () => void;
  canAccessStep: (step: number) => boolean;
}

// Context 생성
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider 컴포넌트 생성
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [completedSteps, setCompletedSteps] = useState(0);

  const completeStep = () => {
    setCompletedSteps((prev) => prev + 1);
  };

  const canAccessStep = (step: number) => {
    return step <= completedSteps + 1; // 다음 단계만 접근 가능
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
