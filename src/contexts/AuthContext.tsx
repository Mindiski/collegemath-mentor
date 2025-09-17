import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuestMode: boolean;
  signOut: () => Promise<void>;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  useEffect(() => {
    // Check for guest mode on load
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuestMode(guestMode);

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        // Exit guest mode when user signs in
        if (session) {
          setIsGuestMode(false);
          localStorage.removeItem('guestMode');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const enterGuestMode = () => {
    setIsGuestMode(true);
    localStorage.setItem('guestMode', 'true');
  };

  const exitGuestMode = () => {
    setIsGuestMode(false);
    localStorage.removeItem('guestMode');
  };

  const value = {
    user,
    session,
    loading,
    isGuestMode,
    signOut,
    enterGuestMode,
    exitGuestMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};