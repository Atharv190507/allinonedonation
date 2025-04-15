import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Donation, DonationType } from '@/types';

interface DonationState {
  donations: Donation[];
  isLoading: boolean;
  error: string | null;
  addDonation: (donation: Omit<Donation, 'id' | 'date' | 'status'>) => Promise<void>;
  getDonationsByUser: (userId: string) => Donation[];
  getDonationsByType: (type: DonationType) => Donation[];
}

export const useDonationStore = create<DonationState>()(
  persist(
    (set, get) => ({
      donations: [],
      isLoading: false,
      error: null,
      addDonation: async (donationData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newDonation: Donation = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            status: 'pending',
            ...donationData,
          };
          
          set(state => ({
            donations: [...state.donations, newDonation],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      getDonationsByUser: (userId: string) => {
        return get().donations.filter(donation => donation.userId === userId);
      },
      getDonationsByType: (type: DonationType) => {
        return get().donations.filter(donation => donation.type === type);
      },
    }),
    {
      name: 'donation-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);