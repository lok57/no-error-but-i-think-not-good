import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

interface UserProfile {
  name?: string;
  phone?: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create default profile if it doesn't exist
      const defaultProfile: UserProfile = {
        email: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(userRef, defaultProfile);
      return defaultProfile;
    }
    
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast.error('Unable to load profile');
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}