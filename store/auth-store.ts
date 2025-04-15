import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, BloodGroup, KYCData } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, bloodGroup?: BloodGroup) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  submitKYC: (kycData: Omit<KYCData, 'submissionDate'>) => Promise<void>;
  getKYCStatus: () => 'not_submitted' | 'pending' | 'verified' | 'rejected';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock validation
          if (email === 'test@example.com' && password === 'password') {
            const user: User = {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              bloodGroup: 'O+',
              kycStatus: 'verified', // Pre-verified for test user
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      register: async (name: string, email: string, password: string, bloodGroup?: BloodGroup) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock registration
          const user: User = {
            id: Date.now().toString(),
            name,
            email,
            bloodGroup,
            kycStatus: 'not_submitted',
          };
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      logout: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call for logout
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Clear user data and set isAuthenticated to false
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed', 
            isLoading: false 
          });
        }
      },
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error('User not found');
          }
          
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      submitKYC: async (kycData: Omit<KYCData, 'submissionDate'>) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error('User not found');
          }
          
          const fullKycData: KYCData = {
            ...kycData,
            submissionDate: new Date().toISOString(),
          };
          
          // Update user with KYC data and set status to pending
          const updatedUser = { 
            ...currentUser, 
            kycData: fullKycData,
            kycStatus: 'pending' as const
          };
          
          set({ user: updatedUser, isLoading: false });
          
          // Simulate automatic verification after 5 seconds (in a real app, this would be handled by a backend)
          setTimeout(() => {
            const user = get().user;
            if (user && user.kycStatus === 'pending') {
              const verifiedUser = {
                ...user,
                kycStatus: 'verified' as const,
                kycData: {
                  ...user.kycData!,
                  verificationDate: new Date().toISOString()
                }
              };
              set({ user: verifiedUser });
            }
          }, 5000);
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      getKYCStatus: () => {
        const user = get().user;
        return user?.kycStatus || 'not_submitted';
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);