// Payment type constants
export const PAYMENT_TYPES = {
  ESPECES: 'ESPECES',
  CHEQUE: 'CHEQUE',
  VIREMENT: 'VIREMENT',
};

export const PAYMENT_TYPE_LABELS = {
  ESPECES: 'Espèces',
  CHEQUE: 'Chèque',
  VIREMENT: 'Virement',
};

// Payment status
export const PAYMENT_STATUS = {
  EN_ATTENTE: 'EN_ATTENTE',
  ENCAISSE: 'ENCAISSE',
  REJETE: 'REJETE',
};

export const PAYMENT_STATUS_LABELS = {
  EN_ATTENTE: 'En attente',
  ENCAISSE: 'Encaissé',
  REJETE: 'Rejeté',
};

// Order status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
};

export const ORDER_STATUS_LABELS = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  CANCELLED: 'Annulée',
  REJECTED: 'Rejetée',
};

// Client loyalty levels
export const LOYALTY_LEVELS = {
  BASIC: 'BASIC',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
};

export const LOYALTY_LEVEL_LABELS = {
  BASIC: 'Basic',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
};

// Loyalty discounts
export const LOYALTY_DISCOUNTS = {
  BASIC: 0,
  SILVER: 5,
  GOLD: 10,
  PLATINUM: 15,
};

// Payment limits
export const ESPECES_MAX_AMOUNT = 20000;
