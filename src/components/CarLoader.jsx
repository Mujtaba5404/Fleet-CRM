import { Box, Portal, Text, VisuallyHidden } from "@mantine/core";
import classes from "./CarLoader.module.css";

const VIEW_WIDTH = 142;
const VIEW_HEIGHT = 64;

const Wheel = ({ cx }) => (
  <g className={classes.wheel}>
    <circle
      cx={cx}
      cy={50}
      r={8.5}
      fill="var(--car-tyre)"
      stroke="var(--car-ink)"
      strokeWidth={1.5}
    />
    {/* Broken ring, so the spin actually reads. */}
    <circle
      cx={cx}
      cy={50}
      r={5}
      fill="none"
      stroke="var(--car-shine)"
      strokeWidth={1.4}
      strokeDasharray="5.5 2.35"
    />
    <circle cx={cx} cy={50} r={2.2} fill="var(--car-paint)" />
  </g>
);

/**
 * The brand loader: a car in the theme colour driving right, speed lines
 * trailing behind. Used for sign in and sign out only; everything else keeps
 * Mantine's `<Loader />`.
 *
 * @param {Object} props
 * @param {number} [props.size] Width in px; the height follows.
 * @param {string} [props.label] Shown under the car; otherwise read out only.
 * @param {boolean} [props.overlay] Cover the whole screen behind a blur.
 */
const CarLoader = ({
  size = 120,
  label,
  overlay = false,
  className,
  ...props
}) => {
  const loader = (
    <Box
      role="status"
      aria-live="polite"
      className={className ? `${classes.root} ${className}` : classes.root}
      {...props}
    >
      <svg
        className={classes.svg}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        width={size}
        height={(size * VIEW_HEIGHT) / VIEW_WIDTH}
        aria-hidden="true"
      >
        {/* Speed lines, farthest first */}
        <g>
          <rect
            x={2}
            y={31}
            width={4.5}
            height={4.5}
            fill="var(--car-paint)"
            className={classes.streak}
          />
          <rect
            x={13}
            y={31.5}
            width={11}
            height={3.5}
            rx={0.5}
            fill="var(--car-ink)"
            className={classes.streak}
          />
          <rect
            x={29}
            y={31.5}
            width={13}
            height={3.5}
            rx={0.5}
            fill="var(--car-ink)"
            className={classes.streak}
          />
          <rect
            x={41}
            y={39}
            width={3.5}
            height={3.5}
            fill="var(--car-ink)"
            className={classes.streak}
          />
        </g>

        {/* Road */}
        <line
          x1={50}
          y1={60}
          x2={138}
          y2={60}
          stroke="var(--car-ink)"
          strokeWidth={3.5}
          strokeLinecap="round"
        />

        <g className={classes.body}>
          {/* Rounded hatch at the back (left), low bonnet at the front (right) */}
          <path
            d="M55 50 C48 50 47 40 50 33 C54 22 67 12 84 11 C98 10 106 17 113 25 L128 28.5 C135.5 30.5 139 35.5 138 42 C137 48 134 50 130 50 Z"
            fill="var(--car-paint)"
            stroke="var(--car-ink)"
            strokeWidth={3.5}
            strokeLinejoin="round"
          />

          {/* Roof shine and belt line */}
          <path
            d="M74 18 C82 14 96 14 105 22"
            fill="none"
            stroke="var(--car-shine)"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
          <path
            d="M57 31 C72 27 98 27 121 29"
            fill="none"
            stroke="var(--car-shine)"
            strokeWidth={1.4}
            strokeLinecap="round"
            opacity={0.85}
          />

          {/* Wheel arches */}
          <path
            d="M56.5 50 A11.5 11.5 0 0 1 79.5 50"
            fill="none"
            stroke="var(--car-shine)"
            strokeWidth={2}
          />
          <path
            d="M108.5 50 A11.5 11.5 0 0 1 131.5 50"
            fill="none"
            stroke="var(--car-shine)"
            strokeWidth={2}
          />
        </g>

        <Wheel cx={68} />
        <Wheel cx={120} />
      </svg>

      {label ? (
        <Text fz="sm" c="dimmed">
          {label}
        </Text>
      ) : (
        <VisuallyHidden>Loading</VisuallyHidden>
      )}
    </Box>
  );

  // Portalled, so a caller inside the header still covers the sidebar too.
  return overlay ? (
    <Portal>
      <div className={classes.overlay}>{loader}</div>
    </Portal>
  ) : (
    loader
  );
};

export default CarLoader;
