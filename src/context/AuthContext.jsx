import { createContext, useContext, useEffect, useState } from 'react'
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { loginWithFirebaseToken, removeToken } from '../services/api'
import { syncBasicProfileToProfile } from '../services/profileSync/basicProfileSync'
import { resetProfile } from '../services/studentProfileService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [backendUser, setBackendUser] = useState(null)
  const [loading, setLoading] = useState(true) // Used only for initial session validation
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        if (!isProcessing) {
          try {
            const idToken = await firebaseUser.getIdToken()
            const data = await loginWithFirebaseToken(idToken)
            setBackendUser(data.user)
          } catch (err) {
            console.warn('[AuthContext] Backend session sync notice:', err?.message || 'Syncing session')
          }
        }
      } else {
        // User is fully logged out — clear state completely
        setUser(null)
        setBackendUser(null)
      }
      setLoading(false) // Resolves only once on application mount
    })
    return unsub
  }, [isProcessing])

  // Single fire-and-forget sync to Unified Student Profile basicProfile section
  useEffect(() => {
    if (user) {
      syncBasicProfileToProfile(user, backendUser)
    }
  }, [user, backendUser])

  const loginWithGoogle = async () => {
    setIsProcessing(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      let backendUserData = null
      try {
        const idToken = await result.user.getIdToken()
        const data = await loginWithFirebaseToken(idToken)
        if (data?.user) {
          backendUserData = data.user
          setBackendUser(data.user)
        }
      } catch (backendErr) {
        console.warn('[AuthContext] Backend session sync notice:', backendErr?.message || 'Proceeding with Firebase session')
      }
      setUser(result.user)
      return { ...result, user: result.user, backendUser: backendUserData }
    } catch (error) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-blocked') {
        console.warn("[AuthContext] Google sign-in popup cancelled or blocked by browser")
      } else {
        console.error("[AuthContext] Google Authentication Error:", error?.message || error)
      }
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const registerWithEmail = async (name, email, password) => {
    setIsProcessing(true)
    try {
      // 1. Create user in Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // 2. Set the display name in Firebase
      await updateProfile(result.user, { displayName: name })
      
      // 3. Send email verification link
      try {
        await sendEmailVerification(result.user)
      } catch (verificationErr) {
        console.warn('[AuthContext] Verification email delivery notice:', verificationErr?.message)
      }
      
      // 4. Force reload user so profile reflects displayName changes
      await result.user.reload()
      
      // 5. Exchange the updated token with backend
      let backendUserData = null
      try {
        const idToken = await auth.currentUser.getIdToken(true)
        const data = await loginWithFirebaseToken(idToken)
        if (data?.user) {
          backendUserData = data.user
          setBackendUser(data.user)
        }
      } catch (backendErr) {
        console.warn('[AuthContext] Backend register token exchange notice:', backendErr?.message)
      }
      
      setUser(auth.currentUser)
      return { ...result, user: auth.currentUser, backendUser: backendUserData }
    } catch (error) {
      if (error?.code === 'auth/email-already-in-use') {
        console.warn('[AuthContext] Email already registered:', email)
      } else {
        console.error("[AuthContext] Registration Error:", error?.message || error)
      }
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const loginWithEmail = async (email, password) => {
    setIsProcessing(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      let backendUserData = null
      try {
        const idToken = await result.user.getIdToken()
        const data = await loginWithFirebaseToken(idToken)
        if (data?.user) {
          backendUserData = data.user
          setBackendUser(data.user)
        }
      } catch (backendErr) {
        console.warn('[AuthContext] Backend session sync notice:', backendErr?.message || 'Proceeding with Firebase session')
      }
      setUser(result.user)
      return { ...result, user: result.user, backendUser: backendUserData }
    } catch (error) {
      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password' || error?.code === 'auth/user-not-found') {
        console.warn('[AuthContext] Invalid credentials provided for login')
      } else {
        console.error("[AuthContext] Email Login Error:", error?.message || error)
      }
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload()
      setUser({ ...auth.currentUser })
    }
  }

  const updateUserPhoto = async (photoUrl) => {
    if (!photoUrl) return
    try {
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { photoURL: photoUrl })
        } catch (fbErr) {
          console.warn('[AuthContext] Firebase updateProfile photo notice:', fbErr)
        }
      }
    } catch (_) {}

    // Update state live
    setUser(prev => prev ? { ...prev, photoURL: photoUrl } : { photoURL: photoUrl })

    // Store in localStorage for instant persistence across reloads
    const currentUid = auth.currentUser?.uid || user?.uid || 'guest'
    try {
      localStorage.setItem('zenscore_custom_avatar', photoUrl)
      localStorage.setItem(`zs_user_avatar_${currentUid}`, photoUrl)
      const personalKey = `zs_personal_data_${currentUid}`
      const savedPersonal = localStorage.getItem(personalKey)
      if (savedPersonal) {
        const parsed = JSON.parse(savedPersonal)
        parsed.photoUrl = photoUrl
        localStorage.setItem(personalKey, JSON.stringify(parsed))
      }
    } catch (_) {}

    // Dispatch global event for instant live reflection across all headers and components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('zenscore:avatar_updated', { detail: { photoUrl } }))
    }
  }


  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.warn('[AuthContext] SignOut notice:', err)
    }
    removeToken()
    resetProfile()
    try {
      localStorage.removeItem('zenscore_selected_career')
      localStorage.removeItem('zenscore_career_onboarding_completed')
      // Clear any other user-specific cached data keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('zenscore_') || key.startsWith('onboarding_') || key.startsWith('zs_') || key.startsWith('zt_')) {
          localStorage.removeItem(key)
        }
      })
    } catch {}
    setUser(null)
    setBackendUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      backendUser, 
      loading, 
      loginWithGoogle, 
      registerWithEmail, 
      loginWithEmail, 
      reloadUser,
      updateUserPhoto,
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) || {
  user: null,
  backendUser: null,
  loading: true,
  loginWithGoogle: async () => {},
  registerWithEmail: async () => {},
  loginWithEmail: async () => {},
  reloadUser: async () => {},
  updateUserPhoto: async () => {},
  logout: async () => {},
}