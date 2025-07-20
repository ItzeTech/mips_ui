// hooks/useSelectedMinerals.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  addMineral, 
  removeMineral, 
  clearAllMinerals, 
  clearMineralsByType,
  SelectedMineral,
  MineralType
} from '../features/minerals/selectedMineralsSlice';
import { Tin } from '../features/minerals/tinSlice';
import { Tantalum } from '../features/minerals/tantalumSlice';
import { Tungsten } from '../features/minerals/tungstenSlice';

export const useSelectedMinerals = () => {
  const dispatch = useDispatch();
  const selectedMinerals = useSelector((state: RootState) => state.selectedMinerals.items);
  
  // Get selected minerals by type
  const getByType = (type: MineralType) => {
    return selectedMinerals.filter((mineral:any) => mineral.type === type);
  };
  
  // Check if a mineral is selected
  const isSelected = (id: string, type: MineralType) => {
    return selectedMinerals.some((mineral: any) => mineral.id === id && mineral.type === type);
  };
  
  // Select a tin mineral
  const selectTin = (tin: Tin) => {
    dispatch(addMineral({
      id: tin.id,
      type: 'tin',
      lotNumber: tin.lot_number,
      supplierName: tin.supplier_name,
      netWeight: tin.net_weight
    }));
  };
  
  // Select a tantalum mineral
  const selectTantalum = (tantalum: Tantalum) => {
    dispatch(addMineral({
      id: tantalum.id,
      type: 'tantalum',
      lotNumber: tantalum.lot_number,
      supplierName: tantalum.supplier_name,
      netWeight: tantalum.net_weight
    }));
  };
  
  // Select a tungsten mineral
  const selectTungsten = (tungsten: Tungsten) => {
    dispatch(addMineral({
      id: tungsten.id,
      type: 'tungsten',
      lotNumber: tungsten.lot_number,
      supplierName: tungsten.supplier_name,
      netWeight: tungsten.net_weight
    }));
  };
  
  // Remove a mineral from selection
  const deselectMineral = (id: string, type: MineralType) => {
    dispatch(removeMineral({ id, type }));
  };
  
  // Clear all selected minerals
  const clearAll = () => {
    dispatch(clearAllMinerals());
  };
  
  // Clear selected minerals of a specific type
  const clearByType = (type: MineralType) => {
    dispatch(clearMineralsByType(type));
  };
  
  // Get count of selected minerals
  const getCount = () => selectedMinerals.length;
  
  // Get count by type
  const getCountByType = (type: MineralType) => 
    selectedMinerals.filter((mineral: any) => mineral.type === type).length;
  
  return {
    selectedMinerals,
    getByType,
    isSelected,
    selectTin,
    selectTantalum,
    selectTungsten,
    deselectMineral,
    clearAll,
    clearByType,
    getCount,
    getCountByType
  };
};