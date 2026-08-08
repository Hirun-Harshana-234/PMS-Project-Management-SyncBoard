import { createContext, useContext, useState } from "react";
import {
  registerOrLogin,
  logout,
  getCurrentUser
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(getCurrentUser());

  const login = (username, password) => {

    const result = registerOrLogin(username, password);

    if(result.success){
      setUser(result.user);
    }

    return result;
  };

  const signOut = () => {
    logout();
    setUser(null);
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        signOut
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export const useAuth = () => useContext(AuthContext);