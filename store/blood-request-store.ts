import { create } from 'zustand';
import { BloodRequest, BloodGroup } from '@/types';
import { bloodRequests } from '@/mocks/blood-requests';

interface BloodRequestState {
  requests: BloodRequest[];
  isLoading: boolean;
  error: string | null;
  getRequests: () => Promise<void>;
  getRequestsByBloodGroup: (bloodGroup: BloodGroup) => BloodRequest[];
  addRequest: (request: Omit<BloodRequest, 'id' | 'date' | 'status'>) => Promise<void>;
}

export const useBloodRequestStore = create<BloodRequestState>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,
  getRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      set({ requests: bloodRequests, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
  getRequestsByBloodGroup: (bloodGroup: BloodGroup) => {
    return get().requests.filter(request => 
      request.bloodGroup === bloodGroup && request.status === 'open'
    );
  },
  addRequest: async (requestData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: BloodRequest = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: 'open',
        ...requestData,
      };
      
      set(state => ({
        requests: [...state.requests, newRequest],
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