import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "offhome-users";
const SESSION_KEY = "offhome-session";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  });
  const [lastCode, setLastCode] = useState(null); // simulated "email" — shown in the UI since there's no mail server here

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  function register({ name, email, password }) {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const code = genCode();
    const newUser = { name, email, password, verified: false, code, createdAt: Date.now() };
    writeUsers([...users, newUser]);
    setLastCode(code);
    return code;
  }

  function resendCode(email) {
    const users = readUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) throw new Error("No account found for this email.");
    const code = genCode();
    users[idx].code = code;
    writeUsers(users);
    setLastCode(code);
    return code;
  }

  function verifyEmail(email, code) {
    const users = readUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) throw new Error("No account found for this email.");
    if (users[idx].code !== code) throw new Error("That verification code is incorrect.");
    users[idx].verified = true;
    writeUsers(users);
    return true;
  }

  function login(email, password) {
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) throw new Error("No account found for this email.");
    if (found.password !== password) throw new Error("Incorrect password.");
    if (!found.verified) {
      const err = new Error("Please verify your email before signing in.");
      err.needsVerification = true;
      throw err;
    }
    const session = { name: found.name, email: found.email };
    setUser(session);
    return session;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, lastCode, register, verifyEmail, resendCode, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
