import { Badge, Group, Loader, Tabs } from "@mantine/core";
import {
  IconReceiptTax,
  IconShieldCheck,
  IconTool,
  IconTrendingDown,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useGetAllDepreciationsQuery } from "../../api/depreciation";
import { useGetAllInsuranceQuery } from "../../api/insurance";
import { useGetAllMaintenanceQuery } from "../../api/maintenance";
import { useGetAllTaxQuery } from "../../api/tax";
import RESOURCES from "../../constants/RESOURCES";
import { usePermissions } from "../../hooks/useCanAccess";
import AddDepreciationModalButton from "../depreciations/AddDepreciationModalButton";
import DepreciationTable from "../depreciations/DepreciationTable";
import AddInsuranceModalButton from "../Insurance/AddInsuranceModalButton";
import InsuranceTable from "../Insurance/InsuranceTable";
import AddMaintenanceModalButton from "../maintenance/AddMaintenanceModalButton";
import MaintenanceTable from "../maintenance/MaintenanceTable";
import AddTaxModalButton from "../tax/AddTaxModalButton";
import TaxTable from "../tax/TaxTable";
import classes from "./VehicleRecords.module.css";

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

const pinToVehicle = (data, fleet) =>
  toList(data).filter((row) => idOf(row.fleet) === fleet._id);


const createVehicleQuery = (useAllQuery, fleet, byPlate = true) =>
  function useVehicleQuery({ page, pageSize, sort, query }) {
    const result = useAllQuery({
      query: byPlate ? { ...query, licensePlate: fleet.licensePlate } : query,
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
    resource: RESOURCES.MAINTENANCE,
    Table: MaintenanceTable,
    AddButton: AddMaintenanceModalButton,
    useAllQuery: useGetAllMaintenanceQuery,
  },
  {
    value: "insurance",
    label: "Insurance",
    icon: IconShieldCheck,
    resource: RESOURCES.INSURANCE,
    Table: InsuranceTable,
    AddButton: AddInsuranceModalButton,
    useAllQuery: useGetAllInsuranceQuery,
  },
  {
    value: "tax",
    label: "Tax",
    icon: IconReceiptTax,
    resource: RESOURCES.TAXATION,
    Table: TaxTable,
    AddButton: AddTaxModalButton,
    useAllQuery: useGetAllTaxQuery,
  },
  {
    value: "depreciation",
    label: "Depreciation",
    icon: IconTrendingDown,
    resource: RESOURCES.DEPRECIATION,
    Table: DepreciationTable,
    AddButton: AddDepreciationModalButton,
    useAllQuery: useGetAllDepreciationsQuery,
    byPlate: false,
  },
];

/** The vehicle's own maintenance, insurance, tax and depreciation, in the usual tables. */
const VehicleRecords = ({ fleet }) => {
  const plate = { query: { licensePlate: fleet.licensePlate } };

  // One count per tab, so you can see what a vehicle has before opening it.
  const counts = {
    maintenance: useGetAllMaintenanceQuery(plate),
    insurance: useGetAllInsuranceQuery(plate),
    tax: useGetAllTaxQuery(plate),
    depreciation: useGetAllDepreciationsQuery({ query: {} }),
  };

  const queryHooks = useMemo(
    () =>
      Object.fromEntries(
        TABS.map((tab) => [
          tab.value,
          createVehicleQuery(
            tab.useAllQuery,
            { _id: fleet._id, licensePlate: fleet.licensePlate },
            tab.byPlate,
          ),
        ]),
      ),
    [fleet._id, fleet.licensePlate],
  );

  // Only the kinds of record this role can read.
  const can = usePermissions();
  const tabs = TABS.filter((tab) => can(tab.resource, "read"));

  const [active, setActive] = useState(null);

  if (!tabs.length) return null;

  const current = tabs.find((tab) => tab.value === active) ?? tabs[0];
  const AddButton = current.AddButton;

  return (
    <Tabs
      value={current.value}
      onChange={setActive}
      variant="pills"
      classNames={{ list: classes.list, tab: classes.tab }}
    >
      {/* Add one for this vehicle without leaving its screen. */}
      <Group justify="space-between" wrap="nowrap" gap="sm" mb="md">
        <Tabs.List>
          {tabs.map(({ value, label, icon: Icon }) => (
            <Tabs.Tab
              key={value}
              value={value}
              leftSection={<Icon size={16} stroke={1.8} />}
              rightSection={
                counts[value].isLoading ? (
                  <Loader size={12} type="oval" color="currentColor" />
                ) : (
                  <Badge
                    size="sm"
                    variant="light"
                    circle
                    className={classes.count}
                  >
                    {pinToVehicle(counts[value].data, fleet).length}
                  </Badge>
                )
              }
            >
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {can(current.resource, "create") && (
          <AddButton fleet={fleet} size="xs" style={{ flexShrink: 0 }} />
        )}
      </Group>

      {tabs.map(({ value, Table }) => (
        <Tabs.Panel key={value} value={value}>
          <Table queryHook={queryHooks[value]} hideColumns={["fleet"]} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default VehicleRecords;
