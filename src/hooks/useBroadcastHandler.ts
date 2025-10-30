// hooks/useBroadcastHandler.ts
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { useUserInfo } from './useUserInfo';

// Import all slice actions
import { Supplier } from '../features/user/suppliersSlice';
import { GeneralSettings } from '../features/settings/generalSettingsSlice';
import { TantalumSettings } from '../features/settings/tantalumSettingSlice';
import { TinSettings } from '../features/settings/tinSettingSlice';
import { TungstenSettings } from '../features/settings/tungstenSettingSlice';
import { MixedMineral } from '../features/minerals/mixedMineralsSlice';
import { Tantalum } from '../features/minerals/tantalumSlice';
import { Tin } from '../features/minerals/tinSlice';
import { Tungsten } from '../features/minerals/tungstenSlice';
import { AdvancePayment } from '../features/finance/advancePaymentSlice';
import { Payment } from '../features/finance/paymentSlice';
import { Expense } from '../features/finance/expenseSlice';
import { Sale } from '../features/finance/salesSlice';

interface BroadcastMessage {
  type: string;
  data: any;
  performed_by: string;
}

export const useBroadcastHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUserInfo();
  
  // Get all state slices
  const suppliers = useSelector((state: RootState) => state.suppliers.suppliers_all);
  const tantalums = useSelector((state: RootState) => state.tantalums.tantalums);
  const tins = useSelector((state: RootState) => state.tins.tins);
  const tungstens = useSelector((state: RootState) => state.tungstens.tungstens);
  const mixedMinerals = useSelector((state: RootState) => state.mixedMinerals.minerals);
  const advancePayments = useSelector((state: RootState) => state.advancePayments.advancePayments);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const payments = useSelector((state: RootState) => state.payments.payments);
  const sales = useSelector((state: RootState) => state.sales.sales);
  
  const handleBroadcastMessage = (msg: BroadcastMessage) => {
    // Skip if message was performed by current user
    if (!user?.id) {
      return;
    }

    // Skip if message was performed by current user
    if (msg.performed_by === user.id) {
      return;
    }

    const { type, data } = msg;

    switch (type) {
      case 'suppliers':
        handleSupplierUpdate(data);
        break;
      
      case 'general_settings':
        handleGeneralSettingsUpdate(data);
        break;
      
      case 'tantalum_settings':
        handleTantalumSettingsUpdate(data);
        break;
      
      case 'tin_settings':
        handleTinSettingsUpdate(data);
        break;
      
      case 'tungsten_settings':
        handleTungstenSettingsUpdate(data);
        break;
      
      case 'mixed_mineral':
        handleMixedMineralUpdate(data);
        break;
      
      case 'tantalum':
        handleTantalumUpdate(data);
        break;
      
      case 'tin':
        handleTinUpdate(data);
        break;
      
      case 'tungsten':
        handleTungstenUpdate(data);
        break;
      
      case 'advance_payment':
        handleAdvancePaymentUpdate(data);
        break;
      
      case 'expense':
        handleExpenseUpdate(data);
        break;
      
      case 'payments':
        handlePaymentUpdate(data);
        break;
      
      case 'sales':
        handleSaleUpdate(data);
        break;
      
      default:
        break;
    }
  };

  // Handler functions for each type
  const handleSupplierUpdate = (data: Supplier) => {
    const existingIndex = suppliers.findIndex(s => s.id === data.id);
    
    if (existingIndex !== -1) {
      // Update existing
      dispatch({ 
        type: 'suppliers/updateSupplier/fulfilled', 
        payload: data 
      });
    } else {
      // Add new
      dispatch({ 
        type: 'suppliers/createSupplier/fulfilled', 
        payload: data 
      });
    }
  };

  const handleGeneralSettingsUpdate = (data: GeneralSettings) => {
    dispatch({ 
      type: 'generalSettings/saveGeneralSettings/fulfilled', 
      payload: data 
    });
  };

  const handleTantalumSettingsUpdate = (data: TantalumSettings) => {
    dispatch({ 
      type: 'tantalumSettings/saveTantalumSettings/fulfilled', 
      payload: data 
    });
  };

  const handleTinSettingsUpdate = (data: TinSettings) => {
    dispatch({ 
      type: 'tinSettings/saveTinSettings/fulfilled', 
      payload: data 
    });
  };

  const handleTungstenSettingsUpdate = (data: TungstenSettings) => {
    dispatch({ 
      type: 'tungstenSettings/saveTungstenSettings/fulfilled', 
      payload: data 
    });
  };

  const handleMixedMineralUpdate = (data: MixedMineral) => {
    const existingIndex = mixedMinerals.findIndex(m => m.id === data.id);
    
    if (existingIndex !== -1) {
      dispatch({ 
        type: 'mixedMinerals/updateMixedMineral/fulfilled', 
        payload: data 
      });
    } else {
      dispatch({ 
        type: 'mixedMinerals/createMixedMineral/fulfilled', 
        payload: data 
      });
    }
  };

  const handleTantalumUpdate = (data: Tantalum) => {
    const existingIndex = tantalums.findIndex(t => t.id === data.id);
    
    if (existingIndex !== -1) {
      dispatch({ 
        type: 'tantalums/updateFinancials/fulfilled', 
        payload: data 
      });
    } else {
      dispatch({ 
        type: 'tantalums/createTantalum/fulfilled', 
        payload: data 
      });
    }
  };

  const handleTinUpdate = (data: Tin) => {
    const existingIndex = tins.findIndex(t => t.id === data.id);
    
    if (existingIndex !== -1) {
      dispatch({ 
        type: 'tins/updateFinancials/fulfilled', 
        payload: data 
      });
    } else {
      dispatch({ 
        type: 'tins/createTin/fulfilled', 
        payload: data 
      });
    }
  };

  const handleTungstenUpdate = (data: Tungsten) => {
    const existingIndex = tungstens.findIndex(t => t.id === data.id);
    
    if (existingIndex !== -1) {
      dispatch({ 
        type: 'tungstens/updateFinancials/fulfilled', 
        payload: data 
      });
    } else {
      dispatch({ 
        type: 'tungstens/createTungsten/fulfilled', 
        payload: data 
      });
    }
  };

  const handleAdvancePaymentUpdate = (data: AdvancePayment) => {
    const existingIndex = advancePayments.findIndex(a => a.id === data.id);
    
    if (existingIndex !== -1) {
      dispatch({ 
        type: 'advancePayments/updateAdvancePayment/fulfilled', 
        payload: data 
      });
    } else {
      dispatch({ 
        type: 'advancePayments/createAdvancePayment/fulfilled', 
        payload: data 
      });
    }
  };

  const handleExpenseUpdate = (data: Expense) => {
    const existingIndex = expenses.findIndex(e => e.id === data.id);
    
    if (existingIndex !== -1) {
      dispatch({ 
        type: 'expenses/updateExpense/fulfilled', 
        payload: data 
      });
    } else {
      dispatch({ 
        type: 'expenses/createExpense/fulfilled', 
        payload: data 
      });
    }
  };

  const handlePaymentUpdate = (data: Payment) => {
    const existingIndex = payments.findIndex(p => p.id === data.id);
    
    if (existingIndex !== -1) {
      dispatch({ 
        type: 'payments/createPayment/fulfilled', 
        payload: data 
      });
    } else {
      dispatch({ 
        type: 'payments/createPayment/fulfilled', 
        payload: data 
      });
    }

    // Update minerals in payment
    if (data.tantalum_minerals && data.tantalum_minerals.length > 0) {
      data.tantalum_minerals.forEach(mineral => {
        const existingTantalumIndex = tantalums.findIndex(t => t.id === mineral.id);
        if (existingTantalumIndex !== -1) {
          dispatch({ 
            type: 'tantalums/updateFinancials/fulfilled', 
            payload: mineral 
          });
        }
      });
    }

    if (data.tin_minerals && data.tin_minerals.length > 0) {
      data.tin_minerals.forEach(mineral => {
        const existingTinIndex = tins.findIndex(t => t.id === mineral.id);
        if (existingTinIndex !== -1) {
          dispatch({ 
            type: 'tins/updateFinancials/fulfilled', 
            payload: mineral 
          });
        }
      });
    }

    if (data.tungsten_minerals && data.tungsten_minerals.length > 0) {
      data.tungsten_minerals.forEach(mineral => {
        const existingTungstenIndex = tungstens.findIndex(t => t.id === mineral.id);
        if (existingTungstenIndex !== -1) {
          dispatch({ 
            type: 'tungstens/updateFinancials/fulfilled', 
            payload: mineral 
          });
        }
      });
    }
  };

  const handleSaleUpdate = (data: Sale) => {
    const existingIndex = sales.findIndex(s => s.id === data.id);
    
    if (existingIndex !== -1) {
      dispatch({ 
        type: 'sales/updateSale/fulfilled', 
        payload: data 
      });
    } else {
      dispatch({ 
        type: 'sales/createSale/fulfilled', 
        payload: data 
      });
    }

    // Update minerals based on mineral_type
    if (data.minerals && data.minerals.length > 0) {
      data.minerals.forEach(saleMineral => {
        let mineral = null;
        
        if (data.mineral_type === 'TANTALUM') {
          mineral = tantalums.find(t => t.id === saleMineral.id);
          if (mineral) {
            dispatch({ 
              type: 'tantalums/updateFinancials/fulfilled', 
              payload: { ...mineral, finance_status: saleMineral.finance_status }
            });
          }
        } else if (data.mineral_type === 'TIN') {
          mineral = tins.find(t => t.id === saleMineral.id);
          if (mineral) {
            dispatch({ 
              type: 'tins/updateFinancials/fulfilled', 
              payload: { ...mineral, finance_status: saleMineral.finance_status }
            });
          }
        } else if (data.mineral_type === 'TUNGSTEN') {
          mineral = tungstens.find(t => t.id === saleMineral.id);
          if (mineral) {
            dispatch({ 
              type: 'tungstens/updateFinancials/fulfilled', 
              payload: { ...mineral, finance_status: saleMineral.finance_status }
            });
          }
        }
      });
    }
  };

  return { handleBroadcastMessage };
};