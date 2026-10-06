import {
  Autocomplete,
  Grid,
  Group,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { IconId, IconRoute, IconTarget } from "@tabler/icons-react";
import FormSection from "../../components/FormSection";
import { ALL_NAV_LINKS } from "../../layouts/navigation";
import classes from "./PermissionMatrix.module.css";
import PermissionMatrix from "./PermissionMatrix";
import { SCOPE_OPTIONS } from "./roleForm";

const LANDING_PATHS = ["/", ...new Set(ALL_NAV_LINKS.map((link) => link.path))];

/** Left column: what the role is called and how far it reaches. */
export const RoleMainFields = ({ form }) => (
  <>
    <FormSection
      title="Role"
      description="How this role is named and where its users start"
      icon={IconId}
    >
      <Grid.Col span={12}>
        <TextInput
          withAsterisk
          label="Role name"
          placeholder="e.g. Fleet manager"
          {...form.getInputProps("title")}
        />
      </Grid.Col>

      <Grid.Col span={12}>
        <Autocomplete
          label="Landing page"
          description="Where people with this role arrive after signing in"
          placeholder="/"
          leftSection={<IconRoute size={16} />}
          data={LANDING_PATHS}
          {...form.getInputProps("indexPath")}
        />
      </Grid.Col>
    </FormSection>

    <FormSection
      title="Data scope"
      description="Which records the permissions apply to"
      icon={IconTarget}
      plain
    >
      <Radio.Group {...form.getInputProps("scope")}>
        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
          {SCOPE_OPTIONS.map(
            ({ value, label, description, icon: Icon, color }) => (
              <Radio.Card
                key={value}
                value={value}
                className={classes.scopeCard}
              >
                <Group gap="sm" wrap="nowrap" align="flex-start">
                  <Radio.Indicator mt={2} />

                  <Stack gap={2} miw={0} flex={1}>
                    <Group gap={6} wrap="nowrap">
                      <ThemeIcon
                        size={20}
                        radius="sm"
                        variant="light"
                        color={color}
                      >
                        <Icon size={13} stroke={1.8} />
                      </ThemeIcon>

                      <Text fz="sm" fw={600}>
                        {label}
                      </Text>
                    </Group>

                    <Text fz="xs" c="dimmed" lh={1.4}>
                      {description}
                    </Text>
                  </Stack>
                </Group>
              </Radio.Card>
            ),
          )}
        </SimpleGrid>
      </Radio.Group>
    </FormSection>
  </>
);

/** Right column: the permission grid. */
export const RoleAsideFields = ({ form, catalog }) => (
  <PermissionMatrix form={form} catalog={catalog} />
);
