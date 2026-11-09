export function normalizeBangladeshPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  const localNumber = digits.startsWith('880') ? `0${digits.slice(3)}` : digits;
  return /^01[3-9]\d{8}$/.test(localNumber) ? localNumber : null;
}
