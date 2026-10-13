import { Badge, Tooltip } from "@mantine/core";
import { getDepreciationMethod } from "./depreciationForm";

const DepreciationMethodBadge = ({ method, size = "sm" }) => {
  const { label, color, description } = getDepreciationMethod(method);

  const badge = (
    <Badge size={size} variant="light" color={color} tt="none" fw={500}>
      {label}
    </Badge>
  );

  return description ? (
    <Tooltip label={description} withArrow>
      {badge}
    </Tooltip>
  ) : (
    badge
  );
};

export default DepreciationMethodBadge;
