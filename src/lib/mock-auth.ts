import { useEffect, useState } from "react";

const KEY = "syncbridge.auth";

export type MockUser = {
  email: string;
  name: string;
  workspace: string;
  role: "owner" | "admin" | "member";
};

function read(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string, name?: string): MockUser {
  const user: MockUser = {
    email,
    name: name ?? email.split("@")[0],
    workspace: "Acme Co",
    role: "owner",
  };
  window.localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("syncbridge:auth"));
  return user;
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("syncbridge:auth"));
}

export function useMockAuth() {
  const [user, setUser] = useState<MockUser | null>(() => read());
  useEffect(() => {
    const sync = () => setUser(read());
    window.addEventListener("syncbridge:auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("syncbridge:auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return user;
}