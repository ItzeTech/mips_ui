/* eslint-disable @typescript-eslint/no-unused-vars */
export const STOCK_STATUS_OPTIONS = {
  'in-stock': { en: 'In Stock', rw: 'ari muri stock' },
  'withdrawn': { en: 'Withdrawn', rw: 'ayasohowe' },
  'resampled': { en: 'Resampled', rw: 'ayasubiwemo' }
};

export const FINANCE_STATUS_OPTIONS = {
  'paid': { en: 'Paid', rw: 'ayishyuwe' },
  'unpaid': { en: 'Unpaid', rw: 'atarishyurwa' },
  'invoiced': { en: 'Invoiced/Finalized', rw: 'ayabariwe' },
  'advance-given': { en: 'Advance Given', rw: 'ayatangiwe advance' },
  'exported': { en: 'Exported', rw: 'ayagemuwe' }
};

export const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0]; // Convert to YYYY-MM-DD format for input
  };

export const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1,
        y: 0,
        transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
        }
    },
    exit: { 
        opacity: 0,
        y: -20,
        transition: { duration: 0.2 }
    }
};


export const formatNumber = (value: number | null | undefined, suffix = '') => {
    if (value === null || value === undefined) return '—';
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}${suffix}`;
  };