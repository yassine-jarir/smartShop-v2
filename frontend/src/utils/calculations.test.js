import { validatePromoCode, roundAmount, calculateOrderTotals, formatAmount, formatDate, formatDateTime } from './calculations';

describe('Calculations Utils', () => {
  
  describe('validatePromoCode', () => {
    it('should validate correct promo code format', () => {
      expect(validatePromoCode('PROMO-1234')).toBe(true);
      expect(validatePromoCode('PROMO-ABCD')).toBe(true);
      expect(validatePromoCode('PROMO-AB12')).toBe(true);
    });

    it('should reject invalid promo code format', () => {
      expect(validatePromoCode('PROMO1234')).toBe(false);
      expect(validatePromoCode('PROMO-')).toBe(false);
      expect(validatePromoCode('PROMO-12')).toBe(false);
      expect(validatePromoCode('PROMO-12345')).toBe(false);
      expect(validatePromoCode('INVALID-1234')).toBe(false);
      expect(validatePromoCode('')).toBe(false);
      expect(validatePromoCode(null)).toBe(false);
    });
  });

  describe('roundAmount', () => {
    it('should round to 2 decimal places', () => {
      expect(roundAmount(10.123)).toBe(10.12);
      expect(roundAmount(10.126)).toBe(10.13);
      expect(roundAmount(10.125)).toBe(10.13);
      expect(roundAmount(10.1)).toBe(10.1);
      expect(roundAmount(10)).toBe(10);
    });

    it('should handle negative numbers', () => {
      expect(roundAmount(-10.123)).toBe(-10.12);
      expect(roundAmount(-10.126)).toBe(-10.13);
    });

    it('should handle zero', () => {
      expect(roundAmount(0)).toBe(0);
      expect(roundAmount(0.001)).toBe(0);
    });
  });

  describe('calculateOrderTotals', () => {
    const items = [
      { prixUnitaire: 100, quantite: 2 }, // 200
      { prixUnitaire: 50, quantite: 3 },  // 150
    ]; // subtotal = 350

    it('should calculate totals without discounts', () => {
      const result = calculateOrderTotals(items, 0, 0);
      expect(result.subtotalHT).toBe(350);
      expect(result.loyaltyAmount).toBe(0);
      expect(result.promoAmount).toBe(0);
      expect(result.htAfterDiscount).toBe(350);
      expect(result.tva).toBe(70); // 20% of 350
      expect(result.totalTTC).toBe(420); // 350 + 70
    });

    it('should calculate loyalty discount correctly', () => {
      const result = calculateOrderTotals(items, 10, 0); // 10% loyalty
      expect(result.subtotalHT).toBe(350);
      expect(result.loyaltyAmount).toBe(35); // 10% of 350
      expect(result.promoAmount).toBe(0);
      expect(result.htAfterDiscount).toBe(315); // 350 - 35
      expect(result.tva).toBe(63); // 20% of 315
      expect(result.totalTTC).toBe(378); // 315 + 63
    });

    it('should calculate promo discount correctly', () => {
      const result = calculateOrderTotals(items, 0, 15); // 15% promo
      expect(result.subtotalHT).toBe(350);
      expect(result.loyaltyAmount).toBe(0);
      expect(result.promoAmount).toBe(52.5); // 15% of 350
      expect(result.htAfterDiscount).toBe(297.5); // 350 - 52.5
      expect(result.tva).toBe(59.5); // 20% of 297.5
      expect(result.totalTTC).toBe(357); // 297.5 + 59.5
    });

    it('should calculate both loyalty and promo discounts', () => {
      const result = calculateOrderTotals(items, 10, 15); // 10% loyalty + 15% promo
      expect(result.subtotalHT).toBe(350);
      expect(result.loyaltyAmount).toBe(35); // 10% of 350
      expect(result.promoAmount).toBe(52.5); // 15% of 350 (not after loyalty)
      expect(result.htAfterDiscount).toBe(262.5); // 350 - 35 - 52.5
      expect(result.tva).toBe(52.5); // 20% of 262.5
      expect(result.totalTTC).toBe(315); // 262.5 + 52.5
    });

    it('should handle empty items array', () => {
      const result = calculateOrderTotals([], 0, 0);
      expect(result.subtotalHT).toBe(0);
      expect(result.loyaltyAmount).toBe(0);
      expect(result.promoAmount).toBe(0);
      expect(result.htAfterDiscount).toBe(0);
      expect(result.tva).toBe(0);
      expect(result.totalTTC).toBe(0);
    });

    it('should handle high discount percentages', () => {
      const result = calculateOrderTotals(items, 15, 20); // 15% loyalty + 20% promo
      expect(result.subtotalHT).toBe(350);
      expect(result.loyaltyAmount).toBe(52.5); // 15% of 350
      expect(result.promoAmount).toBe(70); // 20% of 350 (not after loyalty)
      expect(result.htAfterDiscount).toBe(227.5); // 350 - 52.5 - 70
      expect(result.tva).toBe(45.5); // 20% of 227.5
      expect(result.totalTTC).toBe(273); // 227.5 + 45.5
    });
  });

  describe('formatAmount', () => {
    it('should format amounts with 2 decimals', () => {
      expect(formatAmount(100)).toBe('100.00');
      expect(formatAmount(100.5)).toBe('100.50');
      expect(formatAmount(100.123)).toBe('100.12');
    });

    it('should handle zero', () => {
      expect(formatAmount(0)).toBe('0.00');
    });

    it('should handle large numbers', () => {
      expect(formatAmount(1234567.89)).toBe('1234567.89');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2024-12-15T10:30:00';
      expect(formatDate(date)).toBe('15/12/2024');
    });

    it('should handle date objects', () => {
      const date = new Date('2024-12-15T10:30:00');
      expect(formatDate(date)).toBe('15/12/2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const date = '2024-12-15T10:30:00';
      const result = formatDateTime(date);
      expect(result).toContain('15/12/2024');
      expect(result).toContain('10:30');
    });

    it('should handle date objects', () => {
      const date = new Date('2024-12-15T10:30:00');
      const result = formatDateTime(date);
      expect(result).toContain('15/12/2024');
    });
  });
});
