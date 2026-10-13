import dayjs from "dayjs";
import { DEPRECIATION_METHODS } from "./depreciationForm";

const MONTHS_IN_YEAR = 12;

const round = (value) => Math.round(value * 100) / 100;

/**
 * Client-side projection of a depreciation, month by month.
 *
 * Straight line spreads (cost − salvage) evenly over the useful life. Declining
 * balance applies the yearly `depreciationRate` to the remaining book value
 * each month. Either way the book value never drops below the salvage value.
 *
 * This is an estimate for display; the backend remains the source of truth.
 */
export const buildMonthlySchedule = ({
  method,
  acquisitionCost,
  salvageValue,
  usefulLifeMonths,
  depreciationRate,
  startDate,
}) => {
  const cost = Number(acquisitionCost) || 0;
  const salvage = Number(salvageValue) || 0;
  const months = Math.max(Math.floor(Number(usefulLifeMonths) || 0), 0);
  const monthlyRate = (Number(depreciationRate) || 0) / 100 / MONTHS_IN_YEAR;
  const straightLineCharge = months ? (cost - salvage) / months : 0;
  const start = startDate ? dayjs(startDate) : null;

  const rows = [];
  let bookValue = cost;

  for (let month = 1; month <= months; month += 1) {
    const opening = bookValue;
    const charge =
      method === DEPRECIATION_METHODS.DECLINING_BALANCE
        ? opening * monthlyRate
        : straightLineCharge;

    bookValue = Math.max(opening - charge, salvage);

    rows.push({
      month,
      date: start ? start.add(month - 1, "month").toDate() : null,
      opening: round(opening),
      depreciation: round(opening - bookValue),
      closing: round(bookValue),
    });
  }

  return rows;
};

/** Rolls the monthly schedule up into one row per year of useful life. */
export const toYearlySchedule = (monthly) => {
  const years = [];

  for (let index = 0; index < monthly.length; index += MONTHS_IN_YEAR) {
    const slice = monthly.slice(index, index + MONTHS_IN_YEAR);

    years.push({
      year: years.length + 1,
      from: slice[0].date,
      to: slice.at(-1).date,
      months: slice.length,
      opening: slice[0].opening,
      depreciation: round(
        slice.reduce((total, row) => total + row.depreciation, 0),
      ),
      closing: slice.at(-1).closing,
    });
  }

  return years;
};

/** Whole months from the start date to today, clamped to the useful life. */
export const monthsElapsed = (startDate, usefulLifeMonths) => {
  if (!startDate) return 0;

  const elapsed = dayjs()
    .startOf("month")
    .diff(dayjs(startDate).startOf("month"), "month");

  return Math.min(
    Math.max(elapsed, 0),
    Math.max(Number(usefulLifeMonths) || 0, 0),
  );
};

/** Book value as of today: the closing value of the last month that has passed. */
export const currentBookValue = (depreciation, monthly) => {
  const elapsed = monthsElapsed(
    depreciation.startDate,
    depreciation.usefulLifeMonths,
  );

  return elapsed
    ? monthly[elapsed - 1].closing
    : Number(depreciation.acquisitionCost) || 0;
};

/** The last day of the useful life, or null when it cannot be worked out. */
export const depreciationEndDate = ({ startDate, usefulLifeMonths }) =>
  startDate && Number(usefulLifeMonths)
    ? dayjs(startDate)
        .add(Number(usefulLifeMonths), "month")
        .subtract(1, "day")
        .toDate()
    : null;
