import { Badge, Text } from "@mantine/core";

/**
 * Renders a picklist reference ({ title, color }) as a badge, or an em dash
 * when it is missing.
 *
 * This existed as a near-identical local component in all four detail screens.
 */
const PicklistBadge = ({ item, fallback = "—", ...props }) => {
  const title = typeof item === "object" ? item?.title : item;

  if (!title)
    return (
      <Text size="sm" c="dimmed">
        {fallback}
      </Text>
    );

  return (
    <Badge
      variant="light"
      size="sm"
      color={(typeof item === "object" && item?.color) || "gray"}
      tt="capitalize"
      {...props}
    >
      {title}
    </Badge>
  );
};

export default PicklistBadge;
