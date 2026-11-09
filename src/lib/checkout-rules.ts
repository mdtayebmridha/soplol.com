export const CHECKOUT_RULES = {
  shippingBDT: {
    dhaka: 70,
    outside_dhaka: 130,
  },
  giftWrapFeeBDT: 50,
  coupons: {
    SOPLOL10: 0.1,
    WELCOME: 0.05,
  },
} as const;

export function getCouponRate(code: string) {
  return CHECKOUT_RULES.coupons[code.trim().toUpperCase() as keyof typeof CHECKOUT_RULES.coupons] ?? 0;
}
