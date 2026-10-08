import { Anchor, Group, Text } from "@mantine/core";
import { IconCar } from "@tabler/icons-react";
import { Link } from "react-router-dom";

/** "ABC-123 · 2022 · White", linking to the vehicle. */
const VehicleLink = ({ fleet }) => {
  if (!fleet) return null;

  const details = [fleet.year, fleet.color].filter(Boolean).join(" · ");

  return (
    <Anchor component={Link} to={`/fleets/${fleet._id}`} fz="sm">
      <Group gap={6} wrap="nowrap">
        <IconCar size={16} />

        <Text span fz="sm" fw={600} tt="uppercase">
          {fleet.licensePlate || "Vehicle"}
        </Text>

        {details && (
          <Text span fz="sm" c="dimmed" tt="capitalize">
            · {details}
          </Text>
        )}
      </Group>
    </Anchor>
  );
};

export default VehicleLink;
