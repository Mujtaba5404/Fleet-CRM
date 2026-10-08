import { Paper, Stack, Text } from "@mantine/core";
import classes from "./KeyFacts.module.css";

/**
 * The handful of figures that matter most on a detail screen, in one strip.
 *
 * Keep it to four. Anything shown here should not be repeated further down
 * the page.
 *
 * @param {Object} props
 * @param {Array<{
 *   label: string,
 *   value: ReactNode,
 *   hint?: ReactNode,
 *   hintColor?: string,
 *   tt?: string,
 *   footer?: ReactNode,
 * }>} props.items
 */
const KeyFacts = ({ items }) => {
  const facts = items.filter(Boolean);

  return (
    <Paper style={{ overflow: "hidden" }} mb="md">
      <div className={classes.grid} style={{ "--facts": facts.length }}>
        {facts.map((fact) => (
          <Stack key={fact.label} gap={4} className={classes.cell}>
            <Text fz="xs" fw={600} c="dimmed" tt="uppercase" lts="0.04em">
              {fact.label}
            </Text>

            {typeof fact.value === "string" ||
            typeof fact.value === "number" ? (
              <Text
                fz={22}
                fw={700}
                lh={1.2}
                tt={fact.tt}
                className={classes.value}
                truncate
              >
                {fact.value}
              </Text>
            ) : (
              fact.value
            )}

            {fact.hint && (
              <Text
                fz="xs"
                c={fact.hintColor || "dimmed"}
                fw={fact.hintColor ? 600 : undefined}
                truncate
              >
                {fact.hint}
              </Text>
            )}

            {fact.footer}
          </Stack>
        ))}
      </div>
    </Paper>
  );
};

export default KeyFacts;
