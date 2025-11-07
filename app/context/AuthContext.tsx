"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Customer {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  isVerified: boolean;
}

interface AuthContextType {
  customer: Customer | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error("Failed to fetch customer:", error);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCustomer(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        logout,
        refreshCustomer: fetchCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
