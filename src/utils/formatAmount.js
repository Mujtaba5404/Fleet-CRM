import CURRENCY from "../constants/CURRENCY";

/**
 * The currency every amount in the CRM is displayed in.
 *
 * Change these two lines and the whole app follows: every table cell, detail
 * figure, dashboard tile and form input, because nothing else in the codebase
 * hardcodes a currency.
 *
 * `en-PK` is the locale rather than `en-US` because it renders PKR as "Rs"
 * instead of "PKR", while keeping ordinary thousands grouping
 * (Rs 5,500,000 — not the lakh/crore 55,00,000 form).
 */
const DISPLAY_CURRENCY = CURRENCY.PKR;
const DISPLAY_LOCALE = "en-PK";

/** Just the symbol ("Rs"), derived so form inputs cannot drift from output. */
export const CURRENCY_SYMBOL =
  new Intl.NumberFormat(DISPLAY_LOCALE, {
    style: "currency",
    currency: DISPLAY_CURRENCY,
  })
    .formatToParts(0)
    .find((part) => part.type === "currency")?.value ?? "";

/** Prefix for a NumberInput holding an amount, e.g. "Rs ". */
export const CURRENCY_PREFIX = `${CURRENCY_SYMBOL} `;

const formatAmount = (amount = 0, options = {}) => {
  const defaultOptions = {
    style: "currency",
    currency: DISPLAY_CURRENCY,
    maximumFractionDigits:
      options.notation === "compact" ? 2 : Number.isInteger(amount) ? 0 : 2,
  };

  const formatter = new Intl.NumberFormat(DISPLAY_LOCALE, {
    ...defaultOptions,
    ...options,
  });

  return formatter.format(amount);
};

export default formatAmount;
