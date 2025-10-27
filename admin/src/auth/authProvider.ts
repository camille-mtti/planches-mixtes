import { AuthProvider } from 'react-admin';
import { signInWithGoogle, signOut, onAuthStateChange, getCurrentUser, getUserToken } from '../libs/firebase/auth';
import { message } from 'antd';

export const authProvider: AuthProvider = {
  login: async () => {
    try {
      const user = await signInWithGoogle();
      
      // Optional: Check if user is authorized (admin only)
      const token = await user.getIdTokenResult();
      
      // You can add custom claims check here
      // if (token.claims.admin !== true) {
      //   await signOut();
      //   throw new Error('Unauthorized access');
      // }
      
      message.success(`Welcome back, ${user.displayName || user.email}!`);
      return Promise.resolve();
    } catch (error) {
      console.error('Login error:', error);
      message.error('Failed to sign in');
      return Promise.reject(error);
    }
  },

  logout: async () => {
    try {
      await signOut();
      message.success('Signed out successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Failed to sign out');
      return Promise.reject();
    }
  },

  checkAuth: async () => {
    const user = getCurrentUser();
    if (user) {
      return Promise.resolve();
    }
    return Promise.reject({ redirectTo: '/login' });
  },

  checkError: async (error: any) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      await signOut();
      return Promise.reject({ redirectTo: '/login' });
    }
    return Promise.resolve();
  },

  getIdentity: async () => {
    const user = getCurrentUser();
    if (user) {
      return {
        id: user.uid,
        fullName: user.displayName || user.email || '',
        avatar: user.photoURL || undefined,
      };
    }
    throw new Error('User not authenticated');
  },

  getPermissions: async () => {
    const user = getCurrentUser();
    if (user) {
      // You can customize permissions based on user roles
      return Promise.resolve('admin');
    }
    return Promise.reject();
  },
};

// Auth state manager
export class AuthStateManager {
  private listeners: Array<(authenticated: boolean) => void> = [];

  constructor() {
    onAuthStateChange((user) => {
      const authenticated = user !== null;
      this.listeners.forEach(listener => listener(authenticated));
    });
  }

  subscribe(listener: (authenticated: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  isAuthenticated(): boolean {
    return getCurrentUser() !== null;
  }
}

export const authStateManager = new AuthStateManager();

