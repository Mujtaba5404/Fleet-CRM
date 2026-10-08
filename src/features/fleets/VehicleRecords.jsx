import { Badge, Loader, Tabs } from "@mantine/core";
import { IconReceiptTax, IconShieldCheck, IconTool } from "@tabler/icons-react";
import { useMemo } from "react";
import { useGetAllInsuranceQuery } from "../../api/insurance";
import { useGetAllMaintenanceQuery } from "../../api/maintenance";
import { useGetAllTaxQuery } from "../../api/tax";
import InsuranceTable from "../Insurance/InsuranceTable";
import MaintenanceTable from "../maintenance/MaintenanceTable";
import TaxTable from "../tax/TaxTable";

/** The `/all` endpoints return a bare array; the paginated ones wrap it. */
const toList = (data) => (Array.isArray(data) ? data : (data?.data ?? []));

const idOf = (value) => value?._id ?? value;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

const sortValue = (value) => {
  if (value == null || value === "") return null;
  if (typeof value === "number") return value;
  if (typeof value === "string" && ISO_DATE.test(value))
    return Date.parse(value);

  return String(value).toLowerCase();
};

/** Applies a table sort string ("-createdAt", "cost"); empty values go last. */
const sortRows = (rows, sort) => {
  if (!sort) return rows;

  const desc = sort.startsWith("-");
  const key = desc ? sort.slice(1) : sort;

  return [...rows].sort((a, b) => {
    const x = sortValue(a[key]);
    const y = sortValue(b[key]);

    if (x === y) return 0;
    if (x === null) return 1;
    if (y === null) return -1;

    return (x < y ? -1 : 1) * (desc ? -1 : 1);
  });
};

/** Every record of a kind that belongs to this vehicle, and nothing else. */
const pinToVehicle = (data, fleet) =>
  toList(data).filter((row) => idOf(row.fleet) === fleet._id);

/**
 * Builds a drop-in replacement for a table's paginated query hook that only
 * ever returns this vehicle's records.
 *
 * The plate narrows the request on the server, but a plate search can match
 * other vehicles too ("ABC-1" also finds "ABC-12"), so rows are pinned to the
 * vehicle's id here and paged and sorted locally.
 */
const createVehicleQuery = (useAllQuery, fleet) =>
  function useVehicleQuery({ page, pageSize, sort, query }) {
    const result = useAllQuery({
      query: { ...query, licensePlate: fleet.licensePlate },
    });

    const rows = sortRows(pinToVehicle(result.data, fleet), sort);
    const start = (page - 1) * pageSize;

    return {
      isLoading: result.isLoading,
      isError: result.isError,
      error: result.error,
      data: {
        data: rows.slice(start, start + pageSize),
        meta: { totalCount: rows.length },
      },
    };
  };

const TABS = [
  {
    value: "maintenance",
    label: "Maintenance",
    icon: IconTool,
    Table: MaintenanceTable,
    useAllQuery: useGetAllMaintenanceQuery,
  },
  {
    value: "insurance",
    label: "Insurance",
    icon: IconShieldCheck,
    Table: InsuranceTable,
    useAllQuery: useGetAllInsuranceQuery,
  },
  {
    value: "tax",
    label: "Tax",
    icon: IconReceiptTax,
    Table: TaxTable,
    useAllQuery: useGetAllTaxQuery,
  },
];

/** The vehicle's own maintenance, insurance and tax, in the usual tables. */
const VehicleRecords = ({ fleet }) => {
  const plate = { query: { licensePlate: fleet.licensePlate } };

  // One count per tab, so you can see what a vehicle has before opening it.
  const counts = {
    maintenance: useGetAllMaintenanceQuery(plate),
    insurance: useGetAllInsuranceQuery(plate),
    tax: useGetAllTaxQuery(plate),
  };

  const queryHooks = useMemo(
    () =>
      Object.fromEntries(
        TABS.map((tab) => [
          tab.value,
          createVehicleQuery(tab.useAllQuery, {
            _id: fleet._id,
            licensePlate: fleet.licensePlate,
          }),
        ]),
      ),
    [fleet._id, fleet.licensePlate],
  );

  return (
    <Tabs defaultValue={TABS[0].value}>
      <Tabs.List mb="md">
        {TABS.map(({ value, label, icon: Icon }) => (
          <Tabs.Tab
            key={value}
            value={value}
            leftSection={<Icon size={16} />}
            rightSection={
              counts[value].isLoading ? (
                <Loader size={12} type="oval" />
              ) : (
                <Badge size="sm" variant="light" color="gray" circle>
                  {pinToVehicle(counts[value].data, fleet).length}
                </Badge>
              )
            }
          >
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {TABS.map(({ value, Table }) => (
        <Tabs.Panel key={value} value={value}>
          <Table queryHook={queryHooks[value]} hideColumns={["fleet"]} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default VehicleRecords;
