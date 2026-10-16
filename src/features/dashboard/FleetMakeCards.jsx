import {
  Avatar,
  Badge,
  Box,
  Group,
  Paper,
  Select,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { IconCar } from "@tabler/icons-react";
import { useState } from "react";
import { useGetfleetSummaryByGroupQuery } from "../../api/fleet";
import { useGetAllPicklistsQuery } from "../../api/picklist";
import BarBreakdown from "../../components/BarBreakdown";
import Placeholder from "../../components/Placeholder";
import capitalizeLetters from "../../utils/capitalizeLetters";
import formatAmount from "../../utils/formatAmount";
import getAbbreviation from "../../utils/getAbbreviation";
import { withFallbackColors } from "../../utils/vizPalette";

const UNASSIGNED = "Not set";

const count = (bucket) => Number(bucket?.count) || 0;

const plural = (amount, word) => `${amount} ${word}${amount === 1 ? "" : "s"}`;

const makeKey = (make) => make._id ?? "unassigned";


const mergeMakes = (picklistMakes = [], buckets = []) => {
  const byId = new Map(buckets.map((bucket) => [makeKey(bucket), bucket]));

  const makes = picklistMakes.map((make) => {
    const bucket = byId.get(make._id);
    byId.delete(make._id);

    return {
      ...bucket,
      _id: make._id,
      title: make.title,
      color: make.color ?? bucket?.color,
    };
  });

  return [...makes, ...byId.values()].sort(
    (a, b) =>
      count(b) - count(a) || (a.title || "").localeCompare(b.title || ""),
  );
};


const MakeCard = ({ make, makes, onSelect }) => {
  const makeCount = count(make);


  const picklistModels = useGetAllPicklistsQuery(
    { query: { resource: "Fleet", field: "model", parentPicklist: make._id } },
    { enabled: !!make._id },
  );

  const makeModels = make._id
    ? (Array.isArray(picklistModels.data) ? picklistModels.data : []).filter(
        (model) =>
          (model.parentPicklist?._id ?? model.parentPicklist) === make._id,
      )
    : [];

  const vehiclesByModel = new Map(
    (make.secondaryGroupWise ?? []).map((model) => [
      model._id ?? "unassigned",
      model,
    ]),
  );

  const models = withFallbackColors(
    [
      ...makeModels.map((model) => ({
        key: model._id,
        label: model.title || UNASSIGNED,
        color: model.color || vehiclesByModel.get(model._id)?.color,
        value: count(vehiclesByModel.get(model._id)),
      })),
      ...[...vehiclesByModel]
        .filter(
          ([key, model]) =>
            count(model) > 0 &&
            !makeModels.some((picklistModel) => picklistModel._id === key),
        )
        .map(([key, model]) => ({
          key,
          label: model.title || UNASSIGNED,
          color: model.color,
          value: count(model),
        })),
    ].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label)),
  );

  const withVehicles = models.filter((model) => model.value > 0);

  return (
    <Paper p="lg">
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Group gap="sm" wrap="nowrap" miw={0}>
            <Avatar
              size={38}
              radius="md"
              color={make.color || "blue"}
              variant="light"
            >
              {getAbbreviation(make.title || "?")}
            </Avatar>

            <Stack gap={0} miw={0}>
              <Text fz="md" fw={650} tt="capitalize" truncate>
                {make.title || UNASSIGNED}
              </Text>

              <Text fz="xs" c="dimmed">
                {plural(makeCount, "vehicle")} ·{" "}
                {plural(models.length, "model")} ·{" "}
                {formatAmount(Number(make.purchaseAmount) || 0)}
              </Text>
            </Stack>
          </Group>

          <Select
            size="xs"
            w={170}
            value={makeKey(make)}
            onChange={(value) => value && onSelect(value)}
            allowDeselect={false}
            searchable
            nothingFoundMessage="No make found"
            aria-label="Make"
            data={makes.map((item) => ({
              value: makeKey(item),
              label: `${capitalizeLetters(item.title || UNASSIGNED)} (${count(item)})`,
            }))}
            style={{ flexShrink: 0 }}
          />
        </Group>

        <BarBreakdown
          data={withVehicles}
          emptyMessage="No vehicles of this make yet"
          showLegend={false}
          namedSegments
        />

        {picklistModels.isFetching ? (
          <Skeleton height={22} width="60%" radius="xl" />
        ) : (
          models.length > 0 && (
            <Group gap="xs">
              {models.map((model) => (
                <Badge
                  key={model.key}
                  variant="default"
                  tt="capitalize"
                  fw={500}
                  opacity={model.value ? 1 : 0.55}
                  leftSection={
                    <Box
                      w={8}
                      h={8}
                      style={{
                        borderRadius: 999,
                        background: model.value
                          ? `var(--mantine-color-${model.color}-filled)`
                          : "var(--mantine-color-dimmed)",
                      }}
                    />
                  }
                >
                  {model.label} · {model.value}
                </Badge>
              ))}
            </Group>
          )
        )}
      </Stack>
    </Paper>
  );
};


const FleetMakeCards = () => {
  const [selected, setSelected] = useState(null);

  const summary = useGetfleetSummaryByGroupQuery({
    primaryGroup: "make",
    secondaryGroup: "model",
  });
  const picklistMakes = useGetAllPicklistsQuery({
    query: { resource: "Fleet", field: "make" },
  });

  if (summary.isLoading || picklistMakes.isLoading)
    return <Skeleton height={150} radius="md" />;

  if (summary.isError)
    return (
      <Text fz="sm" c="red">
        {summary.error?.response?.data?.message ||
          summary.error?.message ||
          "Could not load vehicles by make"}
      </Text>
    );

  const makes = mergeMakes(
    Array.isArray(picklistMakes.data) ? picklistMakes.data : [],
    summary.data?.primaryGroupWise ?? [],
  );

  if (!makes.length)
    return (
      <Placeholder
        title="No makes yet"
        description="Add makes under Configuration → Picklists to see them here."
        icon={<IconCar size={32} />}
      />
    );

  const make = makes.find((item) => makeKey(item) === selected) ?? makes[0];

  return <MakeCard make={make} makes={makes} onSelect={setSelected} />;
};

export default FleetMakeCards;