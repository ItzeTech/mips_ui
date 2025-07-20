// features/selectedMinerals/selectedMineralsSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MineralType = 'tin' | 'tantalum' | 'tungsten';

export interface SelectedMineral {
  id: string;
  type: MineralType;
  lotNumber: string;
  supplierName: string;
  netWeight: number;
}

interface SelectedMineralsState {
  items: SelectedMineral[];
}

// Load initial state from localStorage if available
const loadFromStorage = (): SelectedMineral[] => {
  try {
    const savedItems = localStorage.getItem('selectedMinerals');
    return savedItems ? JSON.parse(savedItems) : [];
  } catch (error) {
    console.error('Error loading selected minerals from storage:', error);
    return [];
  }
};

// Save state to localStorage
const saveToStorage = (items: SelectedMineral[]) => {
  try {
    localStorage.setItem('selectedMinerals', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving selected minerals to storage:', error);
  }
};

const initialState: SelectedMineralsState = {
  items: loadFromStorage(),
};

const selectedMineralsSlice = createSlice({
  name: 'selectedMinerals',
  initialState,
  reducers: {
    addMineral: (state, action: PayloadAction<SelectedMineral>) => {
      // Check if the mineral is already selected
      const exists = state.items.some(item => 
        item.id === action.payload.id && item.type === action.payload.type
      );
      
      if (!exists) {
        state.items.push(action.payload);
        saveToStorage(state.items);
      }
    },
    removeMineral: (state, action: PayloadAction<{id: string, type: MineralType}>) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && item.type === action.payload.type)
      );
      saveToStorage(state.items);
    },
    clearAllMinerals: (state) => {
      state.items = [];
      saveToStorage(state.items);
    },
    clearMineralsByType: (state, action: PayloadAction<MineralType>) => {
      state.items = state.items.filter(item => item.type !== action.payload);
      saveToStorage(state.items);
    }
  },
});

export const { 
  addMineral, 
  removeMineral, 
  clearAllMinerals,
  clearMineralsByType
} = selectedMineralsSlice.actions;

export default selectedMineralsSlice.reducer;