import { Divider, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { Fragment } from "react";

const isEmpty = (value) =>
  value === null || value === undefined || value === "" || value === false;

/**
 * Label / value rows, label left and value right. Rows without a value are
 * left out rather than filling the card with dashes.
 */
const PropertyRows = ({ items }) => (
  <Stack gap={10}>
    {items.map((item) => (
      <Group
        key={item.label}
        justify="space-between"
        align="flex-start"
        wrap="nowrap"
        gap="md"
      >
        <Text fz="sm" c="dimmed" style={{ flexShrink: 0 }}>
          {item.label}
        </Text>

        {typeof item.value === "string" || typeof item.value === "number" ? (
          <Text
            fz="sm"
            fw={500}
            ta="right"
            tt={item.tt}
            className={item.numeric ? "numeric" : undefined}
            style={{ wordBreak: "break-word" }}
          >
            {item.value}
          </Text>
        ) : (
          item.value
        )}
      </Group>
    ))}
  </Stack>
);

/**
 * Every secondary field of a record in one card, grouped into titled
 * sections. Sections with nothing to show are dropped.
 *
 * @param {Object} props
 * @param {Array<{
 *   title?: string,
 *   items?: Array<{label: string, value: ReactNode, tt?: string, numeric?: boolean}>,
 *   content?: ReactNode,
 * }>} props.sections
 *   `content` renders free-form (e.g. notes) instead of rows.
 * @param {ReactNode} [props.footer]  Usually <RecordMeta />.
 * @param {Object|number} [props.cols]  Lay sections side by side.
 */
const PropertyCard = ({ sections, footer, cols = 1, ...props }) => {
  const visible = sections
    .map((section) => ({
      ...section,
      items: (section.items || []).filter((item) => !isEmpty(item.value)),
    }))
    .filter((section) => section.content || section.items.length);

  const blocks = visible.map((section) => (
    <Stack key={section.title || "untitled"} gap="sm" miw={0}>
      {section.title && (
        <Text fz="xs" fw={600} c="dimmed" tt="uppercase" lts="0.04em">
          {section.title}
        </Text>
      )}

      {section.content ?? <PropertyRows items={section.items} />}
    </Stack>
  ));

  return (
    <Paper p="lg" {...props}>
      {cols === 1 ? (
        <Stack gap="md">
          {blocks.map((block, index) => (
            <Fragment key={index}>
              {index > 0 && <Divider />}
              {block}
            </Fragment>
          ))}
        </Stack>
      ) : (
        <SimpleGrid cols={cols} spacing="xl" verticalSpacing="lg">
          {blocks}
        </SimpleGrid>
      )}

      {footer && (
        <>
          <Divider my="md" />
          {footer}
        </>
      )}
    </Paper>
  );
};

export default PropertyCard;
