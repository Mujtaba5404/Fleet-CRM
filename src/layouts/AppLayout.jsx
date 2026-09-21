// import { Affix, Group, Paper, Tabs, ThemeIcon } from "@mantine/core";
// import { IconFaceMask } from "@tabler/icons-react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import CanAccess from "../components/CanAccess";
// import UserMenu from "../components/UserMenu";

// const tabs = [
//   { value: "/dashboard", label: "Dashboard" },
//   { value: "/fleet", label: "fleets", },
// ];

// const AppLayout = () => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const active = tabs.find((t) => pathname.startsWith(t.value))?.value ?? null;

//   return (
//     <>
//       {/* <Affix top={0} left={0} right={0} p="md"> */}
//         <Group justify="space-between" p={"lg"}>
//           <ThemeIcon size="xl"><IconFaceMask size={18} /></ThemeIcon>
//           <Paper shadow="md" p={4}>
//             <Tabs variant="pills" value={active} onChange={navigate}>
//               <Tabs.List>
//                 {tabs.map(({ value, label, permission }) => {
//                   const tab = <Tabs.Tab key={value} value={value}>{label}</Tabs.Tab>;
//                   return permission ? <CanAccess key={value} {...permission}>{tab}</CanAccess> : tab;
//                 })}
//               </Tabs.List>
//             </Tabs>
//           </Paper>
//           <UserMenu />
//         </Group>
//       {/* </Affix> */}
//       <Outlet />
//     </>
//   );
// };

// export default AppLayout;
import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

const AppLayout = () => (
  <AppShell header={{ height: 70 }} padding="md">
    <AppShell.Header px="md">
      <AppHeader />
    </AppShell.Header>

    <AppShell.Main>
      <Outlet />
    </AppShell.Main>
  </AppShell>
);

export default AppLayout;
