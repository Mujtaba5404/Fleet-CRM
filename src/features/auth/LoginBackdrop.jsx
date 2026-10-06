import classes from "./Login.module.css";

/**
 * The backdrop behind the sign-in card: a map of routes running under the
 * surface, which is what this product is actually about.
 *
 * Each route is drawn twice — a wide soft stroke for the road, a thin dashed
 * one on top for its lane marking — and the dashes drift along the path, so it
 * reads as movement being tracked rather than as wallpaper. Everything is
 * plain SVG tuned through CSS custom properties, so it costs nothing to load
 * and follows the colour scheme.
 */

// Drawn on a 1600×900 field that is cropped, not squashed, to fit the viewport.
// `cars` lists the vehicles on each road: how long a full run takes, where in
// that run it starts, and whether it drives the road backwards.
const ROUTES = [
  {
    d: "M -60 214 C 250 104 520 296 824 226 S 1300 108 1680 258",
    speed: 7,
    cars: [
      { dur: 22, begin: -3 },
      { dur: 26, begin: -15, reverse: true },
    ],
  },
  {
    d: "M -60 628 C 300 712 524 520 864 604 S 1320 764 1680 646",
    speed: 9,
    cars: [
      { dur: 25, begin: -12 },
      { dur: 21, begin: -4, reverse: true },
    ],
  },
  {
    d: "M 196 -60 C 318 236 150 470 322 696 S 540 980 584 960",
    speed: 11,
    cars: [{ dur: 19, begin: -8 }],
  },
  {
    d: "M 1412 -60 C 1332 198 1486 424 1356 648 S 1286 884 1308 960",
    speed: 8,
    cars: [{ dur: 18, begin: -2, reverse: true }],
  },
];

// Depots and stops. The first two pulse; the rest sit quietly.
const NODES = [
  { x: 824, y: 226, pulse: true },
  { x: 864, y: 604, pulse: true },
  { x: 140, y: 268 },
  { x: 1468, y: 312 },
  { x: 322, y: 696 },
  { x: 1356, y: 648 },
];

/**
 * A small white sedan seen from above, nose pointing along +x so that
 * `rotate="auto"` turns it with the road. It sits a little right of centre,
 * so traffic in each direction keeps to its own side of the lane marking.
 */
const Car = ({ path, dur, begin, reverse }) => (
  <g className={classes.car}>
    <g transform="translate(0 3.5)">
      <rect
        x="-10.5"
        y="-4.5"
        width="22"
        height="10"
        rx="4"
        fill="rgba(15, 23, 42, 0.18)"
      />
      <rect
        x="-11"
        y="-5"
        width="22"
        height="10"
        rx="3.6"
        fill="#fff"
        stroke="rgba(15, 23, 42, 0.28)"
        strokeWidth="0.6"
      />
      <rect x="2.6" y="-3.9" width="3.8" height="7.8" rx="1.3" fill="#1e293b" />
      <rect x="-8" y="-3.9" width="2.6" height="7.8" rx="1" fill="#1e293b" />
      <rect
        x="-5.2"
        y="-3.9"
        width="7.6"
        height="7.8"
        rx="1.2"
        fill="#f1f5f9"
      />
      <rect x="1.8" y="-6" width="1.6" height="1" rx="0.4" fill="#fff" />
      <rect x="1.8" y="5" width="1.6" height="1" rx="0.4" fill="#fff" />
      <rect x="10" y="-4" width="1.1" height="1.8" rx="0.5" fill="#fde68a" />
      <rect x="10" y="2.2" width="1.1" height="1.8" rx="0.5" fill="#fde68a" />
      <rect x="-11.1" y="-4" width="1" height="1.8" rx="0.4" fill="#ef4444" />
      <rect x="-11.1" y="2.2" width="1" height="1.8" rx="0.4" fill="#ef4444" />
    </g>

    <animateMotion
      path={path}
      dur={`${dur}s`}
      begin={`${begin}s`}
      repeatCount="indefinite"
      rotate={reverse ? "auto-reverse" : "auto"}
      {...(reverse && {
        keyPoints: "1;0",
        keyTimes: "0;1",
        calcMode: "linear",
      })}
    />
  </g>
);

const LoginBackdrop = () => (
  <svg
    className={classes.backdrop}
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <pattern
        id="login-grid"
        width="64"
        height="64"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 64 0 H 0 V 64"
          fill="none"
          stroke="var(--login-grid)"
          strokeWidth="1"
        />
      </pattern>

      {/* Holds the grid back where the card sits, so it never fights the form. */}
      <radialGradient id="login-falloff" cx="50%" cy="50%" r="62%">
        <stop offset="0%" stopColor="#000" />
        <stop offset="55%" stopColor="#555" />
        <stop offset="100%" stopColor="#fff" />
      </radialGradient>

      <mask id="login-mask">
        <rect width="1600" height="900" fill="url(#login-falloff)" />
      </mask>
    </defs>

    <rect
      width="1600"
      height="900"
      fill="url(#login-grid)"
      mask="url(#login-mask)"
    />

    {ROUTES.map(({ d }) => (
      <path
        key={d}
        d={d}
        fill="none"
        stroke="var(--login-road)"
        strokeWidth="16"
        strokeLinecap="round"
      />
    ))}

    {ROUTES.map(({ d, speed }) => (
      <path
        key={`lane-${d}`}
        className={classes.lane}
        style={{ animationDuration: `${speed}s` }}
        d={d}
        fill="none"
        stroke="var(--login-lane)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    ))}

    {NODES.map(({ x, y, pulse }) => (
      <g key={`${x}-${y}`}>
        {pulse && (
          <circle
            className={classes.pulse}
            cx={x}
            cy={y}
            r="9"
            fill="var(--login-node)"
          />
        )}

        <circle
          cx={x}
          cy={y}
          r="9"
          fill="none"
          stroke="var(--login-node)"
          strokeWidth="2"
        />

        <circle cx={x} cy={y} r="3.5" fill="var(--login-node)" />
      </g>
    ))}

    {ROUTES.flatMap(({ d, cars }) =>
      cars.map((car) => <Car key={`${d}-${car.begin}`} path={d} {...car} />),
    )}
  </svg>
);

export default LoginBackdrop;
