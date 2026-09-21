import {
  Box,
  Button,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconAt,
  IconBriefcase,
  IconLock,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const STATS = [
  { icon: IconUsers, label: "Active clients", value: "1,284" },
  { icon: IconBriefcase, label: "Open deals", value: "326" },
  { icon: IconTrendingUp, label: "Win rate", value: "32%" },
];
const glass = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.2)",
  backdropFilter: "blur(10px)",
};
const ring = (size, pos) => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.15)",
  ...pos,
});

const BrandPanel = memo(() => (
  <Box
    visibleFrom="md"
    pos="relative"
    p={"xl"}
    c="white"
    style={{
      overflow: "hidden",
      background:
        "linear-gradient(150deg, var(--mantine-primary-color-5), var(--mantine-primary-color-9))",
    }}
  >
    <Box style={ring(420, { top: -160, left: -140 })} />
    <Box style={ring(300, { bottom: -120, left: 60 })} />
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top: 0,
        right: -1,
        height: "100%",
        width: 70,
      }}
    >
      <path
        d="M100 0H55C95 35 10 65 60 100H100Z"
        style={{ fill: "var(--mantine-color-body)" }}
      />
    </svg>
    <Stack h="100%" justify="space-between" pos="relative" pr={40}>
      <Text fw={800} fz={22}>
        C.R.M
      </Text>
      <Stack gap="md">
        <Title order={2} c="white" fz={32}>
          Manage clients, deals and your team in one place.
        </Title>
        <Text opacity={0.85} fz="sm">
          Track every lead from first contact to closed deal.
        </Text>
        <Paper radius="md" p="md" style={glass}>
          <SimpleGrid cols={3}>
            {STATS.map(({ icon: Icon, label, value }) => (
              <Stack key={label} gap={4}>
                <Icon size={18} stroke={1.6} />
                <Text fw={700} fz="lg" c="white">
                  {value}
                </Text>
                <Text fz="xs" opacity={0.8}>
                  {label}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Paper>
      </Stack>
      <Text fz="xs" opacity={0.7}>
        © {new Date().getFullYear()} fleet CRM
      </Text>
    </Stack>
  </Box>
));

const Login = () => {
  const [, setAuth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });
  const navigate = useNavigate();
  // const loginMutation = useLoginMutation();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
  });

  // const handleSubmit = (values) => {
  //   loginMutation.mutate(values, {
  //     onSuccess: ({ data }) => {
  //       setAuth(data);
  //       navigate(data?.indexPath || "/dashboard", { replace: true });
  //     },
  //   });
  // };
  const handleSubmit = (values) => {
    // TODO: API lagne par ye hata kar loginMutation.mutate(...) wapas lagayein
    setAuth({ name: "Super Admin", email: values.email });
    navigate("/fleets/dashboard", { replace: true });
  };

  return (
    <Box
      mih="100vh"
      p={{ base: "md", sm: "xl" }}
      bg={dark ? "dark.8" : "gray.1"}
      style={{ display: "grid", placeItems: "center" }}
    >
      <Paper
        w="100%"
        maw={980}
        radius="lg"
        shadow="xl"
        withBorder
        style={{ overflow: "hidden" }}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0} mih={580}>
          <BrandPanel />

          <Stack justify="center" p={{ base: "xl", sm: 56 }} gap="xl">
            <Stack gap={6}>
              <ThemeIcon hiddenFrom="md" size={44} radius="md" mb="sm">
                <IconBriefcase size={24} />
              </ThemeIcon>
              <Title order={1} fz={28} fw={700}>
                Welcome back
              </Title>
              <Text c="dimmed" fz="sm">
                Sign in to your CRM account to continue.
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
                placeholder="johndoe@example.com"
                radius="md"
                leftSection={<IconAt size={18} stroke={1.6} />}
                leftSectionPointerEvents="none"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                autoComplete="current-password"
                label="Password"
                placeholder="Your password"
                radius="md"
                leftSection={<IconLock size={18} stroke={1.6} />}
                leftSectionPointerEvents="none"
                key={form.key("password")}
                {...form.getInputProps("password")}
              />
              <Button type="submit" radius="md" mt="sm" fullWidth>
                Login
              </Button>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Paper>
    </Box>
  );
};

export default Login;
