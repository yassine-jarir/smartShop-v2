// Validate promo code format (PROMO-XXXX)
export const validatePromoCode = (code) => {
  const promoPattern = /^PROMO-[A-Z0-9]{4}$/;
  return promoPattern.test(code);
};

// Round amount to 2 decimal places
export const roundAmount = (amount) => {
  return Math.round(amount * 100) / 100;
};

// Calculate order totals
export const calculateOrderTotals = (items, loyaltyDiscount = 0, promoDiscount = 0) => {
  // Calculate subtotal (HT - before tax)
  const subtotalHT = items.reduce((sum, item) => {
    return sum + (item.prixUnitaire * item.quantite);
  }, 0);

  // Apply loyalty discount (percentage)
  const loyaltyAmount = (subtotalHT * loyaltyDiscount) / 100;

  // Apply promo discount (percentage)
  const promoAmount = (subtotalHT * promoDiscount) / 100;

  // HT after discounts
  const htAfterDiscount = subtotalHT - loyaltyAmount - promoAmount;

  // Calculate TVA (20%)
  const tva = htAfterDiscount * 0.20;

  // Total TTC (with tax)
  const totalTTC = htAfterDiscount + tva;

  return {
    subtotalHT: roundAmount(subtotalHT),
    loyaltyAmount: roundAmount(loyaltyAmount),
    promoAmount: roundAmount(promoAmount),
    totalDiscount: roundAmount(loyaltyAmount + promoAmount),
    htAfterDiscount: roundAmount(htAfterDiscount),
    tva: roundAmount(tva),
    totalTTC: roundAmount(totalTTC),
  };
};

// Format amount with 2 decimal places
export const formatAmount = (amount) => {
  return amount?.toFixed(2) || '0.00';
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR');
};

// Format datetime
export const formatDateTime = (datetime) => {
  if (!datetime) return '';
  return new Date(datetime).toLocaleString('fr-FR');
};
