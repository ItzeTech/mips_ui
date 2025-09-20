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

const initialState: SelectedMineralsState = {
  items: [], // No longer loading from localStorage
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
        // Removed saveToStorage call
      }
    },
    removeMineral: (state, action: PayloadAction<{id: string, type: MineralType}>) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && item.type === action.payload.type)
      );
      // Removed saveToStorage call
    },
    clearAllMinerals: (state) => {
      state.items = [];
      // Removed saveToStorage call
    },
    clearMineralsByType: (state, action: PayloadAction<MineralType>) => {
      state.items = state.items.filter(item => item.type !== action.payload);
      // Removed saveToStorage call
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