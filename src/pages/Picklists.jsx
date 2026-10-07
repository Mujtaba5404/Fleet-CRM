import {
  Box,
  NavLink,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const BASE = "/admin-settings/picklists";

/**
 * Picklists are configuration, not a workflow, so they get a settings style
 * two pane layout rather than a tab strip: fifteen tabs never fit on screen.
 */
const GROUPS = [
  {
    label: "Vehicles",
    items: [
      { value: "fleet-make", label: "Make" },
      { value: "fleet-model", label: "Model" },
      { value: "fleet-type", label: "Type" },
      { value: "fleet-fuel-type", label: "Fuel type" },
      { value: "fleet-transmission", label: "Transmission" },
      { value: "fleet-status", label: "Status" },
      { value: "fleet-condition", label: "Condition" },
    ],
  },
  {
    label: "Maintenance",
    items: [
      { value: "maintenance-type", label: "Type" },
      { value: "maintenance-status", label: "Status" },
      { value: "maintenance-priority", label: "Priority" },
      { value: "maintenance-provider", label: "Provider" },
    ],
  },
  {
    label: "Inspection checklist",
    items: [
      { value: "checklist-item", label: "Item" },
      { value: "checklist-status", label: "Status" },
      { value: "checklist-condition", label: "Condition" },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.label })),
);

const DEFAULT_ITEM = "fleet-make";

const Picklists = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const lastSegment = pathname.split("/").filter(Boolean).pop();
  const active =
    ALL_ITEMS.find((item) => item.value === lastSegment)?.value ?? DEFAULT_ITEM;
  const activeItem = ALL_ITEMS.find((item) => item.value === active);

  return (
    <>
      <PageHeader
        title="Picklists"
        description="The dropdown values used across vehicles, maintenance and inspections."
        breadcrumbs={[
          { label: "Configuration" },
          { label: "Picklists", to: BASE },
          { label: `${activeItem.group} · ${activeItem.label}` },
        ]}
      />

      {/* Phones get a single select; there is no room for a side rail. */}
      <Box hiddenFrom="sm" mb="md">
        <Select
          value={active}
          onChange={(value) => navigate(`${BASE}/${value}`)}
          allowDeselect={false}
          searchable={false}
          data={GROUPS.map((group) => ({
            group: group.label,
            items: group.items.map((item) => ({
              value: item.value,
              label: item.label,
            })),
          }))}
        />
      </Box>

      <Box
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--mantine-spacing-md)",
        }}
      >
        <Paper
          p="xs"
          w={230}
          visibleFrom="sm"
          style={{ flexShrink: 0, position: "sticky", top: 76 }}
        >
          <ScrollArea.Autosize mah="calc(100vh - 160px)" scrollbarSize={4}>
            <Stack gap="xs">
              {GROUPS.map((group) => (
                <Stack key={group.label} gap={2}>
                  <Text
                    fz={11}
                    fw={600}
                    c="dimmed"
                    tt="uppercase"
                    lts="0.05em"
                    px="xs"
                    pt={6}
                  >
                    {group.label}
                  </Text>

                  {group.items.map((item) => (
                    <NavLink
                      key={item.value}
                      label={item.label}
                      active={active === item.value}
                      variant="light"
                      onClick={() => navigate(`${BASE}/${item.value}`)}
                      styles={{
                        root: { borderRadius: "var(--mantine-radius-sm)" },
                        label: { fontSize: "var(--mantine-font-size-sm)" },
                      }}
                    />
                  ))}
                </Stack>
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </Paper>

        <Box flex={1} miw={0}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Picklists;
