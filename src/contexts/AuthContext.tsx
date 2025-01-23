import { createContext, useContext, useState, useEffect } from 'react';
import {
  socialLogin,
  login,
  logout,
  onUserStateChange,
  signup,
} from '@apis/firebase';

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    onUserStateChange((user) => setUser(user));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        uid: user && user.uid,
        socialLogin,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}