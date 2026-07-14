import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

/**
 * AuthProvider 컴포넌트
 * Supabase 인증 세션과 mfi_users 프로필을 로드하여 하위 컴포넌트에 제공한다.
 *
 * Props:
 * @param {node} children - 인증 컨텍스트 하위에 렌더링할 요소 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    supabase
      .from('mfi_users')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [session]);

  const signUp = ({ email, password, name, phone }) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });

  const signIn = ({ email, password }) => supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      signUp,
      signIn,
      signOut,
    }),
    [session, profile, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth 훅
 * AuthProvider 내부에서 현재 사용자, 프로필, 인증 함수를 반환한다.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  }
  return context;
}
