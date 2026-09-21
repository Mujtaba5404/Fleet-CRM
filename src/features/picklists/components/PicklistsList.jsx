import { Badge, Group, Loader, Paper, SimpleGrid, Stack, Title, Tooltip } from "@mantine/core";
import { IconFiles, IconSettingsCheck, IconX } from "@tabler/icons-react";
import groupBy from "lodash/groupBy";
import { useGetAllPicklistsQuery } from "../../../api/picklist";
import Placeholder from "../../../components/Placeholder";
import { usePicklists } from "../../../context/PicklistContext";
import DeletePicklistButton from "./DeletePicklistButton";
import EditPicklistModalButton from "./EditPicklistModalButton";

function groupPicklistsByParentPicklist(picklists = []) {
  const grouped = groupBy(picklists, (p) => p.parentPicklist?._id || null);

  return Object.values(grouped)
    .map((children) => ({ parentPicklist: children[0].parentPicklist, picklists: children }))
    .sort((a, b) => {
      const titleA = a.parentPicklist?.title || "";
      const titleB = b.parentPicklist?.title || "";

      return titleA.localeCompare(titleB);
    });
}

const PicklistsList = ({ children }) => {
  const { featureName, scope, resource, field, parentPicklist } = usePicklists();
  const { data, isLoading, isError } = useGetAllPicklistsQuery({ query: { scope, resource, field, parentPicklist } });

  if (isLoading) return <Loader />;

  if (isError) return <Placeholder title="Error" icon={<IconX size={50} />} />;

  if (!data?.length) return <Placeholder title={`No ${featureName} to display`} icon={<IconFiles size={50} />} />;

  const groupedPicklists = groupPicklistsByParentPicklist(data);

  return groupedPicklists.map(({ parentPicklist, picklists }) => (
    <Stack key={parentPicklist?._id || "no-parent"} gap={"xs"}>
      {parentPicklist && (
        <Group gap={"xs"}>
          <Title order={5} fw={600} tt={"capitalize"}>
            {parentPicklist.title}
          </Title>

          <Badge>{picklists.length} picklists</Badge>
        </Group>
      )}

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {picklists.map((picklist) => {
          return (
            <Paper key={picklist._id} p={"sm"}>
              <Group gap={0}>
                <Group gap={"xs"} mr={"auto"}>
                  {children ? children(picklist) : <Badge color={picklist.color}>{picklist.title}</Badge>}

                  {picklist.isDefault && (
                    <Tooltip label="Default">
                      <IconSettingsCheck size={18} />
                    </Tooltip>
                  )}
                </Group>

                <EditPicklistModalButton picklist={picklist} />

                <DeletePicklistButton picklistId={picklist._id} />
              </Group>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Stack>
  ));
};

export default PicklistsList;
