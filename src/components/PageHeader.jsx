import {
  ActionIcon,
  Anchor,
  Badge,
  Breadcrumbs,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

/**
 * The header every page shares: breadcrumbs, title, a short description and
 * the page level actions.
 *
 * @param {Object}   props
 * @param {string}   props.title
 * @param {string}   [props.description]
 * @param {Array<{label: string, to?: string}>} [props.breadcrumbs]
 * @param {ReactNode} [props.badge]    Rendered next to the title (e.g. a count).
 * @param {ReactNode} [props.actions]  Buttons, aligned right on desktop.
 * @param {boolean}  [props.back]      Show a back arrow (detail pages).
 */
const PageHeader = ({
  title,
  description,
  breadcrumbs = [],
  badge,
  actions,
  back = false,
}) => {
  const navigate = useNavigate();

  return (
    <Stack gap="xs" mb="md">
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

      <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
        <Group gap="sm" wrap="nowrap" miw={0} align="center">
          {back && (
            <ActionIcon
              size="lg"
              radius="md"
              variant="default"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <IconChevronLeft size={18} />
            </ActionIcon>
          )}

          <Stack gap={2} miw={0}>
            <Group gap="xs" wrap="nowrap" miw={0}>
              <Title order={2} tt="capitalize" truncate>
                {title}
              </Title>

              {typeof badge === "number" || typeof badge === "string" ? (
                <Badge variant="light" size="sm">
                  {badge}
                </Badge>
              ) : (
                badge
              )}
            </Group>

            {description && (
              <Text fz="sm" c="dimmed">
                {description}
              </Text>
            )}
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

export default PageHeader;
