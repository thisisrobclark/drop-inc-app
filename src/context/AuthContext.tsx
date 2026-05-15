import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Profile } from '../lib/types'
import { useDemo } from './DemoContext'

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, meta: Partial<Profile>) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null; needsMfa?: boolean }>
  signOut: () => Promise<void>
  sendPhoneOtp: (phone: string) => Promise<{ error: string | null }>
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>
  refreshProfile: () => Promise<void>
}

/**
 * Where the Supabase password-reset email link should land users. Falls back to the deployed web app
 * so the same flow works whether the email is opened on a phone or a desktop.
 */
const PASSWORD_RESET_REDIRECT =
  (typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/reset-password`
    : 'https://drop-inc-app.vercel.app/reset-password')

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isDemoMode, getDemoUser, getDemoProfile, getDemoSession, exitDemo } = useDemo()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  useEffect(() => {
    // Skip Supabase auth in demo mode
    if (isDemoMode) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [isDemoMode])

  const signUp = async (email: string, password: string, meta: Partial<Profile>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: meta.full_name || '',
          farm_name: meta.farm_name || '',
          phone: meta.phone || '',
          physical_address: meta.physical_address || '',
          mailing_address: meta.mailing_address || '',
          delivery_directions: meta.delivery_directions || '',
        },
      },
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signOut = async () => {
    if (isDemoMode) {
      exitDemo()
      return
    }
    await supabase.auth.signOut()
    setProfile(null)
  }

  const sendPhoneOtp = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) return { error: error.message }
    return { error: null }
  }

  const verifyPhoneOtp = async (phone: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
    if (error) return { error: error.message }
    return { error: null }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: PASSWORD_RESET_REDIRECT,
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    return { error: null }
  }

  const updateProfile = async (data: Partial<Profile>) => {
    if (isDemoMode) return { error: 'Profile editing disabled in demo mode' }
    if (!user) return { error: 'Not authenticated' }
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
    if (error) return { error: error.message }
    await fetchProfile(user.id)
    return { error: null }
  }

  const refreshProfile = async () => {
    if (isDemoMode) return
    if (user) await fetchProfile(user.id)
  }

  // In demo mode, return mock data
  const value: AuthState = isDemoMode
    ? {
        session: getDemoSession(),
        user: getDemoUser(),
        profile: getDemoProfile(),
        loading: false,
        signUp,
        signIn,
        signOut,
        sendPhoneOtp,
        verifyPhoneOtp,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshProfile,
      }
    : {
        session, user, profile, loading,
        signUp, signIn, signOut,
        sendPhoneOtp, verifyPhoneOtp,
        resetPassword, updatePassword,
        updateProfile, refreshProfile,
      }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
