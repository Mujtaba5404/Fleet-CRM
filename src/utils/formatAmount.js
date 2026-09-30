/**
 * The currency every amount in the CRM is displayed in.
 *
 * NOTE: this is "USD", which is what the app has always rendered — but the
 * data model says otherwise (CURRENCY lists PKR first and SittingCostHeads
 * defaults to it, and the domain language is challans and jurisdictions).
 * If amounts should read as PKR, change this one line.
 */
const DISPLAY_CURRENCY = "USD";

const formatAmount = (amount = 0, options = {}) => {
  const defaultOptions = {
    style: "currency",
    currency: DISPLAY_CURRENCY,
    maximumFractionDigits:
      options.notation === "compact" ? 2 : Number.isInteger(amount) ? 0 : 2,
  };

  const formatter = new Intl.NumberFormat("en-US", {
    ...defaultOptions,
    ...options,
  });

  return formatter.format(amount);
};

export default formatAmount;
