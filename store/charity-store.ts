import { create } from 'zustand';
import { Charity, DonationType } from '@/types';
import { charities as mockCharities } from '@/mocks/charities';

interface CharityState {
  charities: Charity[];
  isLoading: boolean;
  error: string | null;
  getCharities: () => Promise<void>;
  getCharitiesByCategory: (category: DonationType) => Charity[];
  getCharityById: (id: string) => Charity | undefined;
  addCharity: (charityData: Omit<Charity, 'id' | 'rating' | 'donationsCount'>) => Promise<void>;
}

export const useCharityStore = create<CharityState>((set, get) => ({
  charities: [],
  isLoading: false,
  error: null,
  getCharities: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      set({ charities: mockCharities, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
  getCharitiesByCategory: (category: DonationType) => {
    return get().charities.filter(charity => 
      charity.categories.includes(category)
    );
  },
  getCharityById: (id: string) => {
    return get().charities.find(charity => charity.id === id);
  },
  addCharity: async (charityData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new charity with default values for rating and donations
      const newCharity: Charity = {
        id: Date.now().toString(),
        rating: 4.5, // Default rating
        donationsCount: 0, // New charity starts with 0 donations
        ...charityData,
      };
      
      // Add to existing charities
      set(state => ({
        charities: [newCharity, ...state.charities],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
}));