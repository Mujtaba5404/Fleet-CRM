/**
 * Hues for chart rows with no configured colour, in fixed order.
 *
 * Validated as a categorical set (adjacent CVD separation, lightness band,
 * normal-vision floor) at shade 6 on light and shade 7 on dark, which is what
 * the theme's primaryShade and useVizColor pick. Orange and lime were dropped:
 * no shade of either sits inside the dark-mode lightness band.
 */
export const FALLBACK_COLORS = [
  "blue",
  "teal",
  "grape",
  "cyan",
  "pink",
  "indigo",
];

const NEUTRAL_KEYS = new Set(["other", "unassigned"]);

/**
 * Fills in `color` for rows that lack one. A row's own colour (a picklist's
 * configured colour) always wins, and "Other" / "Unassigned" are gray, so
 * colour follows the entity rather than its rank.
 */
export const withFallbackColors = (rows) => {
  let next = 0;

  return rows.map((row) => {
    if (row.color) return row;
    if (NEUTRAL_KEYS.has(row.key)) return { ...row, color: "gray" };

    return { ...row, color: FALLBACK_COLORS[next++ % FALLBACK_COLORS.length] };
  });
};
