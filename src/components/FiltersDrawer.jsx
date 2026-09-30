import {
  Button,
  Divider,
  Drawer,
  Group,
  Indicator,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconFilterOff } from "@tabler/icons-react";
import useFilters from "../hooks/useFilters";

const isEmpty = (value) =>
  value == null || value === "" || (Array.isArray(value) && value.length === 0);

/**
 * Renders the "Filters" trigger plus the drawer that holds the controls.
 *
 * Filters live in the URL (see `useFilters`), so the drawer is stateless: it
 * just gives them somewhere to live that works on a phone. `children` is a
 * render function receiving `{ filters, setFilters }`.
 */
const FiltersDrawer = ({ title = "Filters", children }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { filters, setFilters, resetFilters } = useFilters();

  const activeCount = Object.values(filters).filter((v) => !isEmpty(v)).length;

  return (
    <>
      <Indicator
        disabled={!activeCount}
        label={activeCount}
        size={16}
        offset={4}
      >
        <Button
          variant="default"
          onClick={open}
          leftSection={<IconFilter size={18} />}
        >
          Filters
        </Button>
      </Indicator>

      <Drawer opened={opened} onClose={close} title={title} size="sm">
        <Stack h="100%" gap={0}>
          <ScrollArea flex={1} offsetScrollbars>
            <Stack gap="md" pb="md">
              {typeof children === "function"
                ? children({ filters, setFilters })
                : children}
            </Stack>
          </ScrollArea>

          <Divider mb="sm" />

          <Group grow>
            <Button
              variant="default"
              disabled={!activeCount}
              leftSection={<IconFilterOff size={18} />}
              onClick={() => resetFilters()}
            >
              Clear all
            </Button>

            <Button onClick={close}>Done</Button>
          </Group>

          {activeCount > 0 && (
            <Text fz="xs" c="dimmed" ta="center" mt={6}>
              {activeCount} filter{activeCount === 1 ? "" : "s"} applied
            </Text>
          )}
        </Stack>
      </Drawer>
    </>
  );
};

export default FiltersDrawer;
