/** Whole days from one date to another, never negative; null if either is missing. */
const daysBetween = (from, to) => {
  if (!from || !to) return null;

  return Math.max(0, Math.round((new Date(to) - new Date(from)) / 86400000));
};

export default daysBetween;
