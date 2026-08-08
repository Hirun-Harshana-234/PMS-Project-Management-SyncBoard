const USERS_KEY = "users";
const CURRENT_USER = "currentUser";

export const registerOrLogin = (username, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    if (existingUser.password !== password) {
      return {
        success: false,
        message: "Incorrect password"
      };
    }

    localStorage.setItem(CURRENT_USER, JSON.stringify(existingUser));

    return {
      success: true,
      user: existingUser
    };
  }

  const newUser = {
    id: Date.now(),
    username,
    password
  };

  users.push(newUser);

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER, JSON.stringify(newUser));

  return {
    success: true,
    user: newUser
  };
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(CURRENT_USER));
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER);
};