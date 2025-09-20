/* eslint-disable @typescript-eslint/no-unused-vars */
export const STOCK_STATUS_OPTIONS = {
  'in-stock': 'stockStatus.in-stock',
  'withdrawn': 'stockStatus.withdrawn',
  'resampled': 'stockStatus.resampled',
  'exported': 'stockStatus.exported',
};

export const FINANCE_STATUS_OPTIONS = {
  paid: 'financeStatus.paid',
  unpaid: 'financeStatus.unpaid',
  invoiced: 'financeStatus.invoiced',
  exported: 'financeStatus.exported'
};


export const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
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