import {
  Box,
  Button,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconAt,
  IconLock,
  IconReceiptTax,
  IconShieldCheck,
  IconTool,
  IconTruck,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authUserId } from "../../api/access";
import { useLoginMutation } from "../../api/auth";
import Logo from "../../components/Logo";
import {
  sessionAccessQuery,
  toSessionAccess,
} from "../../hooks/useSessionAccess";
import classes from "./Login.module.css";
import LoginBackdrop from "./LoginBackdrop";

/** What the product actually does, rather than generic CRM copy. */
const HIGHLIGHTS = [
  { icon: IconTruck, label: "Vehicles", note: "Specs, status and odometer" },
  { icon: IconTool, label: "Maintenance", note: "Jobs, checklists and photos" },
  { icon: IconShieldCheck, label: "Insurance", note: "Policies and renewals" },
  { icon: IconReceiptTax, label: "Tax", note: "Challans and filing dates" },
];

const BrandPanel = memo(() => (
  <Box visibleFrom="md" className={classes.brandPanel}>
    <div className={classes.glow} />

    <Stack h="100%" justify="space-between" pos="relative" gap="xl">
      <Text fw={800} fz="lg" lts="0.02em">
        FleetCRM
      </Text>

      <Stack gap="lg">
        <Title order={2} c="white" fz={30} lh={1.25}>
          Every vehicle, service and renewal in one place.
        </Title>

        <Text opacity={0.85} fz="sm">
          Stop chasing spreadsheets for what is due, what is covered and what it
          cost.
        </Text>

        <SimpleGrid cols={2} spacing="sm">
          {HIGHLIGHTS.map(({ icon: Icon, label, note }) => (
            <Paper key={label} className={classes.glassCard} p="sm" radius="md">
              <Icon size={18} stroke={1.6} />

              <Text fw={600} fz="sm" c="white" mt={6}>
                {label}
              </Text>

              <Text fz="xs" opacity={0.75} lh={1.35}>
                {note}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>

      <Text fz="xs" opacity={0.7}>
        © {new Date().getFullYear()} FleetCRM
      </Text>
    </Stack>
  </Box>
));

BrandPanel.displayName = "BrandPanel";

const Login = () => {
  const [, setAuth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  // Signed in, still fetching permissions: keep the button busy.
  const [opening, setOpening] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email address",
      password: (value) => (value ? null : "Password is required"),
    },
  });

  // The response is the profile and the companies this user belongs to (which
  // feed every company select). Permissions come from the user's Access record,
  // fetched before leaving so the app opens with its menu and pages in place
  // instead of blank. If that fails, RequireAuth asks again and explains.
  const handleSubmit = (values) => {
    loginMutation.mutate(values, {
      onSuccess: async ({ data }) => {
        let session = data;

        // Stored first: the API layer reads the token from it for the access call.
        setAuth(data);
        setOpening(true);

        try {
          const access = await queryClient.fetchQuery(
            sessionAccessQuery(authUserId(data)),
          );
          session = { ...data, ...toSessionAccess(access) };
        } catch {
          // Left to RequireAuth.
        }

        setAuth(session);
        setOpening(false);

        // The role's landing page; "/" picks the first screen the role can read.
        navigate(session?.indexPath || "/", { replace: true });
      },
    });
  };

  return (
    <Box className={classes.page}>
      <LoginBackdrop />

      <Paper
        w="100%"
        maw={1000}
        radius="lg"
        shadow="xl"
        className={classes.card}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0} mih={560}>
          <BrandPanel />

          <Stack justify="center" p={{ base: "xl", sm: 48 }} gap="xl">
            <Stack gap={6}>
              <Box hiddenFrom="md" mb="xs">
                <Logo w={150} alt="FleetCRM" />
              </Box>

              <Title order={1} fz={28} fw={700}>
                Welcome back
              </Title>

              <Text c="dimmed" fz="sm">
                Sign in to manage your fleet.
              </Text>
            </Stack>

            <Stack
              component="form"
              gap="md"
              onSubmit={form.onSubmit(handleSubmit)}
              noValidate
            >
              <TextInput
                type="email"
                autoFocus
                autoComplete="email"
                label="Email address"
                placeholder="you@company.com"
                leftSection={<IconAt size={18} stroke={1.6} />}
                leftSectionPointerEvents="none"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />

              <PasswordInput
                autoComplete="current-password"
                label="Password"
                placeholder="Your password"
                leftSection={<IconLock size={18} stroke={1.6} />}
                leftSectionPointerEvents="none"
                key={form.key("password")}
                {...form.getInputProps("password")}
              />

              <Button
                type="submit"
                mt="sm"
                fullWidth
                loading={loginMutation.isPending || opening}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Paper>
    </Box>
  );
};

export default Login;
