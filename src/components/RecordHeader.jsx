import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

/**
 * The header of a detail screen: who the record is, where it stands and what
 * you can do with it. One header instead of a page header plus a hero card,
 * which printed the title twice.
 *
 * @param {Object} props
 * @param {ReactNode} props.title
 * @param {Array<{label: string, to?: string}>} [props.breadcrumbs]
 * @param {ReactNode} [props.avatar]   Shown left of the title.
 * @param {ReactNode} [props.badges]   Status and other state, next to the title.
 * @param {ReactNode} [props.meta]     One line of context under the title.
 * @param {ReactNode} [props.actions]  Buttons, aligned right on desktop.
 * @param {string} [props.titleTransform]  CSS text-transform for the title.
 */
const RecordHeader = ({
  title,
  breadcrumbs = [],
  avatar,
  badges,
  meta,
  actions,
  titleTransform = "capitalize",
}) => {
  const navigate = useNavigate();

  return (
    <Stack gap="xs" mb="lg">
      {breadcrumbs.length > 0 && (
        <Breadcrumbs fz="xs" c="dimmed">
          {breadcrumbs.map((crumb, index) =>
            crumb.to ? (
              <Anchor
                key={index}
                component={Link}
                to={crumb.to}
                fz="xs"
                c="dimmed"
              >
                {crumb.label}
              </Anchor>
            ) : (
              <Text key={index} fz="xs" c="dimmed" truncate maw={200}>
                {crumb.label}
              </Text>
            ),
          )}
        </Breadcrumbs>
      )}

      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Group gap="md" wrap="nowrap" miw={0} align="center">
          <ActionIcon
            size="lg"
            radius="md"
            variant="default"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <IconChevronLeft size={18} />
          </ActionIcon>

          {avatar}

          <Stack gap={4} miw={0}>
            <Group gap="xs" wrap="wrap" miw={0}>
              <Title order={2} tt={titleTransform} lh={1.2}>
                {title}
              </Title>

              {badges}
            </Group>

            {meta &&
              (typeof meta === "string" ? (
                <Text fz="sm" c="dimmed">
                  {meta}
                </Text>
              ) : (
                meta
              ))}
          </Stack>
        </Group>

        {actions && (
          <Group gap="xs" wrap="nowrap">
            {actions}
          </Group>
        )}
      </Group>
    </Stack>
  );
};

export default RecordHeader;
