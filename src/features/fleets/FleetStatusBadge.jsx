import { Badge } from "@mantine/core";
import { getFleetStatusOption, toFleetStatus } from "./fleetStatus";

const FleetStatusBadge = ({ status, size = "sm", ...props }) => {
  const option = getFleetStatusOption(toFleetStatus(status));

  if (!option)
    return (
      <Badge size={size} color="gray" tt="capitalize" {...props}>
        {(typeof status === "object" ? status?.title : status) || "—"}
      </Badge>
    );

  const Icon = option.icon;

  return (
    <Badge
      size={size}
      color={option.color}
      tt="capitalize"
      leftSection={<Icon size={12} stroke={2} />}
      {...props}
    >
      {option.label}
    </Badge>
  );
};

export default FleetStatusBadge;
