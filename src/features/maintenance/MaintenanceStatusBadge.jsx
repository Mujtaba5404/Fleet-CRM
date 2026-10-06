import { Badge } from "@mantine/core";
import { getMaintenanceStatusOption } from "./maintenanceForm";

const MaintenanceStatusBadge = ({ status, size = "sm", ...props }) => {
  const option = getMaintenanceStatusOption(status);

  if (!option)
    return (
      <Badge size={size} color="gray" tt="capitalize" {...props}>
        {status || "—"}
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

export default MaintenanceStatusBadge;
