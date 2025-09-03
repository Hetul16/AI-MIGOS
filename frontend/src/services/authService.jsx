// services/authService.js
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

const API_BASE_URL = 'http://localhost:8000/api';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isLoading = true;
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.isLoading = false;
    });
  }

  // Register with email and password
  async registerWithEmail(userData) {
    try {
      const { email, password, fullName, travelPreferences, subscribeNewsletter } = userData;
      
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Step 2: Update user profile with display name
      await updateProfile(user, {
        displayName: fullName
      });
      
      // Step 3: Create user document in Firestore directly (primary)
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName,
        email,
        travelPreferences: travelPreferences || [],
        subscribeNewsletter: subscribeNewsletter || false,
        createdAt: serverTimestamp(),
        profileComplete: false,
        authProvider: 'email'
      });

      // Step 4: Sync with backend (optional - don't block on failure)
      this.syncUserWithBackend(user, {
        full_name: fullName,
        email,
        travel_preferences: travelPreferences,
        subscribe_newsletter: subscribeNewsletter
      });

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Login with email and password
  async loginWithEmail(email, password, rememberMe = false) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp()
      });

      // Sync with backend (optional - don't block on failure)
      this.syncLoginWithBackend(user);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Google OAuth login
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const isNewUser = !userDoc.exists();
      
      if (isNewUser) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          fullName: user.displayName || '',
          email: user.email,
          travelPreferences: [],
          subscribeNewsletter: false,
          createdAt: serverTimestamp(),
          profileComplete: false,
          authProvider: 'google'
        });
      }

      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp()
      });

      // Sync with backend (optional)
      this.syncGoogleAuthWithBackend(user);

      return { success: true, user, isNewUser };
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Send password reset email
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user profile from Firestore
  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  // Update user profile
  async updateUserProfile(uid, profileData) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...profileData,
        updatedAt: serverTimestamp()
      });

      // Also update Firebase Auth profile if display name changed
      if (profileData.fullName && this.currentUser) {
        await updateProfile(this.currentUser, {
          displayName: profileData.fullName
        });
      }

      // Sync with backend (optional)
      this.syncProfileUpdateWithBackend(uid, profileData);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Get current user token
  async getCurrentUserToken() {
    if (this.currentUser) {
      return await this.currentUser.getIdToken();
    }
    return null;
  }

  // ==================== Backend Sync Methods (Optional/Async) ====================
  
  async syncUserWithBackend(user, userData) {
    try {
      const token = await user.getIdToken();
      await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      console.log('✅ User synced with backend');
    } catch (error) {
      console.warn('⚠️ Backend user sync failed (non-critical):', error);
    }
  }

  async syncLoginWithBackend(user) {
    try {
      const token = await user.getIdToken();
      await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Login synced with backend');
    } catch (error) {
      console.warn('⚠️ Backend login sync failed (non-critical):', error);
    }
  }

  async syncGoogleAuthWithBackend(user) {
    try {
      const token = await user.getIdToken();
      await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: token })
      });
      console.log('✅ Google auth synced with backend');
    } catch (error) {
      console.warn('⚠️ Backend Google auth sync failed (non-critical):', error);
    }
  }

  async syncProfileUpdateWithBackend(uid, profileData) {
    try {
      const token = await this.getCurrentUserToken();
      if (!token) return;

      await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: profileData.fullName,
          travel_preferences: profileData.travelPreferences,
          subscribe_newsletter: profileData.subscribeNewsletter,
          profile_complete: profileData.profileComplete
        })
      });
      console.log('✅ Profile update synced with backend');
    } catch (error) {
      console.warn('⚠️ Backend profile sync failed (non-critical):', error);
    }
  }

  // Helper method to get user-friendly error messages
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email address';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled';
      case 'auth/popup-blocked':
        return 'Please allow popups for this site to sign in with Google';
      default:
        return 'An error occurred during authentication';
    }
  }
}

export default new AuthService();