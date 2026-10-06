import { Badge, Tooltip } from "@mantine/core";
import { getScopeOption } from "./roleForm";

const ScopeBadge = ({ scope, size = "sm" }) => {
  const option = getScopeOption(scope);

  if (!option)
    return (
      <Badge size={size} color="gray" tt="capitalize">
        {scope || "—"}
      </Badge>
    );

  const Icon = option.icon;

  return (
    <Tooltip label={option.description}>
      <Badge
        size={size}
        color={option.color}
        tt="capitalize"
        leftSection={<Icon size={12} stroke={2} />}
      >
        {option.label} scope
      </Badge>
    </Tooltip>
  );
};

export default ScopeBadge;
