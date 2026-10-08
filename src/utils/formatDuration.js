const plural = (count, unit) => `${count} ${unit}${count === 1 ? "" : "s"}`;

/**
 * A span of days in words. Under a year it stays in days ("45 days"); from
 * 365 days on it reads in years and months ("1 year 4 months", "2 years").
 *
 * @param {number|null} days
 * @returns {string|null}
 */
const formatDuration = (days) => {
  if (days == null) return null;

  if (days < 365) return plural(days, "day");

  let years = Math.floor(days / 365);
  let months = Math.floor((days % 365) / 30);

  // 360–364 leftover days would otherwise read as "12 months".
  if (months >= 12) {
    years += 1;
    months = 0;
  }

  return months
    ? `${plural(years, "year")} ${plural(months, "month")}`
    : plural(years, "year");
};

export default formatDuration;
