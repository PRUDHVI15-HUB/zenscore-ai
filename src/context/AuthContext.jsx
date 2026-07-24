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
            console.error('Backend auth error:', err)
          }
        }
      } else {
        setUser(null)
        setBackendUser(null)
        removeToken()
      }
      setLoading(false) // Resolves only once on application mount
    })
    return unsub
  }, [isProcessing])

  const loginWithGoogle = async () => {
    setIsProcessing(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      const data = await loginWithFirebaseToken(idToken)
      setBackendUser(data.user)
      setUser(result.user)
      return result
    } catch (error) {
      console.error("Google Authentication Error:", error)
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
      await sendEmailVerification(result.user)
      
      // 4. Force reload user so profile reflects displayName changes
      await result.user.reload()
      
      // 5. Exchange the updated token with backend
      const idToken = await auth.currentUser.getIdToken(true)
      const data = await loginWithFirebaseToken(idToken)
      
      setBackendUser(data.user)
      setUser(auth.currentUser)
      return result
    } catch (error) {
      console.error("Registration Error:", error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const loginWithEmail = async (email, password) => {
    setIsProcessing(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await result.user.getIdToken()
      const data = await loginWithFirebaseToken(idToken)
      setBackendUser(data.user)
      setUser(result.user)
      return result
    } catch (error) {
      console.error("Email Login Error:", error)
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

  const logout = async () => {
    await signOut(auth)
    removeToken()
    setUser(null)
    setBackendUser(null)
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
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)