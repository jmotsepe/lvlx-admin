import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { supabaseClient } from "@/utils/supabase/client";

const AuthContext = createContext({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          const query = queryString.parse(window.location.hash.substring(1));
          const queryStringified = queryString.stringify(query);
          router.push(`/authentication/reset-password?${queryStringified}`);
        } else {
          setUser(session?.user);
        }
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
