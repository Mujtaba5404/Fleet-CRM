import { Badge } from "@mantine/core";
import { getEffectiveInsuranceStatus } from "./insuranceStatus";

/** The policy's status: saved enum value, or what its dates imply. */
const InsuranceStatusBadge = ({ insurance, size = "sm", ...props }) => {
  const option = getEffectiveInsuranceStatus(insurance);
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

export default InsuranceStatusBadge;
