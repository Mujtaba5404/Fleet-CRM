import { Paper, ScrollArea, Tabs } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const tabList = [
  { label: upperFirst("picklists"), value: "picklists", index: true },
];

const AdminSettings = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const indexTab = tabList.find((tab) => tab.index);

  const pathParts = pathname.split("/");

  const adminIndex = pathParts.indexOf("admin-settings");
  const currentSection = pathParts[adminIndex + 1];

  const activeTab = tabList.find((tab) => tab.value === currentSection)?.value || indexTab.value;

  return (
    <>
      <Tabs variant="pills" mb="lg" value={activeTab} onChange={(value) => navigate(`/admin-settings/${value}`)}>
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

export default AdminSettings;