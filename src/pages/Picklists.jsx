import { Paper, ScrollArea, Tabs } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const tabList = [
  { label: upperFirst("fleet make"), value: "fleet-make", index: true },
  { label: upperFirst("fleet model"), value: "fleet-model" },
  { label: upperFirst("fleet type"), value: "fleet-type" },
  { label: upperFirst("fleet fuel type"), value: "fleet-fuel-type" },
  { label: upperFirst("fleet transmission"), value: "fleet-transmission" },
  { label: upperFirst("fleet status"), value: "fleet-status" },
  { label: upperFirst("fleet condition"), value: "fleet-condition" },
  { label: upperFirst("maintenance type"), value: "maintenance-type" },
  { label: upperFirst("maintenance status"), value: "maintenance-status" },
  { label: upperFirst("maintenance priority"), value: "maintenance-priority" },
  { label: upperFirst("maintenance provider"), value: "maintenance-provider" },
  { label: upperFirst("maintenance components"), value: "maintenance-components" },
  { label: upperFirst("checklist item"), value: "checklist-item" },
  { label: upperFirst("checklist status"), value: "checklist-status" },
  { label: upperFirst("checklist condition"), value: "checklist-condition" },
];

const Picklists = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const indexTab = tabList.find((tab) => tab.index);

  const pathParts = pathname.split("/");
  const lastSegment = pathParts[pathParts.length - 1];

  const activeTab =
    tabList.find((tab) => tab.value === lastSegment)?.value || indexTab.value;

  return (
    <>
      <Tabs
        variant="pills"
        mb="lg"
        value={activeTab}
        onChange={(value) => navigate(`/admin-settings/picklists/${value}`)}
      >
        <Paper p={4}>
          <ScrollArea w="100%" scrollbars="x" scrollbarSize={10}>
            <Tabs.List style={{ flexWrap: "nowrap" }}>
              {tabList.map((tab, i) => (
                <Tabs.Tab key={i} value={tab.value}>
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </ScrollArea>
        </Paper>
      </Tabs>

      <Outlet />
    </>
  );
};

export default Picklists;
