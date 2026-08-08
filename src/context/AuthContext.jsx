import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "syncboard_users";
const CURRENT_USER_KEY = "syncboard_current_user";

function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(CURRENT_USER_KEY));
  } catch {
    return null;
  }
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrentUser(user) {
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());

  const login = (username, password) => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return {
        success: false,
        message: "Username and password are required."
      };
    }

    const users = getUsers();
    const existingUser = users.find(
      (item) => item.username === trimmedUsername
    );

    if (existingUser) {
      if (existingUser.password !== trimmedPassword) {
        return {
          success: false,
          message: "Incorrect password."
        };
      }

      saveCurrentUser(existingUser);
      setUser(existingUser);

      return {
        success: true,
        user: existingUser
      };
    }

    const newUser = {
      id: Date.now(),
      username: trimmedUsername,
      password: trimmedPassword
    };

    const nextUsers = [...users, newUser];
    saveUsers(nextUsers);
    saveCurrentUser(newUser);
    setUser(newUser);

    return {
      success: true,
      user: newUser
    };
  };

  const logout = () => {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
