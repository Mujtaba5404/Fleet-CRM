import { Group, Paper, ScrollArea, Stack, Tabs } from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CanAccess from "../components/CanAccess";

const TabbedLayout = ({ tabs = [], rightSlots = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const activeTab =
    tabs.find(
      (tab) =>
        tab.path &&
        pathname.includes(tab.path.startsWith("/") ? tab.path : `/${tab.path}`),
    )?.value || tabs.find((tab) => !tab.path)?.value;

  const rightSlot = rightSlots[activeTab];

  return (
    <Stack gap={"sm"}>
      <Group wrap="nowrap" justify="space-between">
        <Tabs
          miw={0}
          value={activeTab}
          variant="pills"
          onChange={(value) => {
            if (!value) return;

            const tab = tabs.find((t) => t.value === value);

            navigate(tab?.path ?? ".");
          }}
        >
          <Paper style={{ minWidth: 0 }} p={4}>
            <ScrollArea>
              <Tabs.List style={{ flexWrap: "nowrap" }}>
                {tabs.map((tab) => {
                  const TabNode = (
                    <Tabs.Tab key={tab.value} value={tab.value}>
                      {tab.label}
                    </Tabs.Tab>
                  );

                  if (!tab.permission) {
                    return TabNode;
                  }

                  return (
                    <CanAccess
                      key={tab.value}
                      resource={tab.permission.resource}
                      action={tab.permission.action}
                    >
                      {TabNode}
                    </CanAccess>
                  );
                })}
              </Tabs.List>
            </ScrollArea>
          </Paper>
        </Tabs>

        {rightSlot ?? null}
      </Group>

      <Outlet />
    </Stack>
  );
};

export default TabbedLayout;
