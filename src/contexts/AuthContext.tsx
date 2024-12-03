import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  User,
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { getUserProfile, updateUserProfile } from '../services/firebase/userProfile';
import toast from 'react-hot-toast';

interface UserProfile {
  name?: string;
  phone?: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateEmail: (currentPassword: string, newEmail: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as Auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
      setCurrentUser(userCredential.user);
      toast.success('Successfully logged in!');
    } catch (err) {
      const errorMessage = 'Failed to login. Please check your credentials';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const register = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
      
      if (displayName && userCredential.user) {
        await firebaseUpdateProfile(userCredential.user, { displayName });
      }
      
      setCurrentUser(userCredential.user);
      toast.success('Account created successfully!');
    } catch (err) {
      const errorMessage = 'Failed to create account';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth as Auth, provider);
      setCurrentUser(result.user);
      toast.success('Successfully signed in with Google!');
    } catch (err) {
      const errorMessage = 'Failed to sign in with Google';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      await updateUserProfile(currentUser.uid, data);
      if (data.name) {
        await firebaseUpdateProfile(currentUser, { displayName: data.name });
      }
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
    } catch (err) {
      const errorMessage = 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateEmail = async (currentPassword: string, newEmail: string) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await firebaseUpdateEmail(currentUser, newEmail);
      toast.success('Email updated successfully');
    } catch (err) {
      const errorMessage = 'Failed to update email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await firebaseUpdatePassword(currentUser, newPassword);
      toast.success('Password updated successfully');
    } catch (err) {
      const errorMessage = 'Failed to update password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth as Auth, email);
      toast.success('Password reset email sent!');
    } catch (err) {
      const errorMessage = 'Failed to send password reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth as Auth);
      setCurrentUser(null);
      setUserProfile(null);
      toast.success('Successfully logged out!');
    } catch (err) {
      const errorMessage = 'Failed to logout';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const value = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    resetPassword,
    googleSignIn,
    updateProfile,
    updateEmail,
    updatePassword,
    error,
    clearError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}