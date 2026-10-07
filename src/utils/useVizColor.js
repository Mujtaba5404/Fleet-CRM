import { useComputedColorScheme, useMantineTheme } from "@mantine/core";

/**
 * Resolves a picklist's configured colour to the shade a chart paints with.
 *
 * Matches the theme's primaryShade (6 light, 7 dark), so an SVG chart and a
 * Mantine Progress bar given the same colour key render the same hue. Anything
 * without a colour falls back to the single-hue viz fill, so a chart never
 * invents an identity for a bucket that has none.
 */
const useVizColor = () => {
  const theme = useMantineTheme();
  const dark =
    useComputedColorScheme("light", { getInitialValueInEffect: true }) ===
    "dark";

  return (color) => {
    const swatches = color && theme.colors[color];

    if (!swatches) return "var(--viz-fill)";

    return dark ? swatches[7] : swatches[6];
  };
};

export default useVizColor;
