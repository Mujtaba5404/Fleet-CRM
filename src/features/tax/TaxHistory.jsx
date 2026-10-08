import {
  Anchor,
  Badge,
  Center,
  Group,
  Loader,
  Table,
  Text,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useGetTaxWithPaginationQuery } from "../../api/tax";
import DetailPanel from "../../components/DetailPanel";
import PicklistBadge from "../../components/PicklistBadge";
import daysBetween from "../../utils/daysBetween";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import formatDuration from "../../utils/formatDuration";

const HISTORY_SIZE = 50;

const idOf = (value) => value?._id ?? value;

/**
 * Every challan logged against the same vehicle, newest period first, with
 * the record being viewed highlighted.
 */
const TaxHistory = ({ tax }) => {
  const fleetId = idOf(tax.fleet);

  const history = useGetTaxWithPaginationQuery({
    page: 1,
    pageSize: HISTORY_SIZE,
    sort: "-startDate",
    query: { licensePlate: tax.fleet?.licensePlate },
  });

  // The plate search can match more than one vehicle, so pin it to this one.
  const records = (history.data?.data ?? []).filter(
    (row) => idOf(row.fleet) === fleetId,
  );
  const total = records.reduce(
    (sum, row) => sum + (Number(row.taxAmount) || 0),
    0,
  );
  const truncated = (history.data?.meta?.totalCount ?? 0) > HISTORY_SIZE;

  return (
    <DetailPanel
      title="Vehicle tax history"
      action={
        records.length > 0 && (
          <Text fz="xs" c="dimmed">
            {truncated ? `Latest ${records.length}` : records.length}{" "}
            {records.length === 1 ? "challan" : "challans"} ·{" "}
            <Text
              span
              fz="xs"
              fw={600}
              c="var(--mantine-color-text)"
              className="numeric"
            >
              {formatAmount(total)}
            </Text>
          </Text>
        )
      }
    >
      {history.isLoading ? (
        <Center h={80}>
          <Loader />
        </Center>
      ) : history.isError ? (
        <Text fz="sm" c="dimmed">
          Could not load this vehicle&apos;s other tax records.
        </Text>
      ) : records.length <= 1 ? (
        <Text fz="sm" c="dimmed">
          This is the only tax record for this vehicle so far.
        </Text>
      ) : (
        <Table.ScrollContainer minWidth={560}>
          <Table verticalSpacing="xs" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Challan</Table.Th>
                <Table.Th>Period</Table.Th>
                <Table.Th>Filed</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th ta="right">Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {records.map((row) => {
                const current = row._id === tax._id;
                const length = formatDuration(
                  daysBetween(row.startDate, row.endDate),
                );

                return (
                  <Table.Tr
                    key={row._id}
                    bg={
                      current ? "var(--mantine-primary-color-light)" : undefined
                    }
                  >
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        {current ? (
                          <Text fz="sm" fw={600} tt="uppercase">
                            {row.challanNumber || "—"}
                          </Text>
                        ) : (
                          <Anchor
                            component={Link}
                            to={`/tax/${row._id}`}
                            fz="sm"
                            fw={600}
                            tt="uppercase"
                          >
                            {row.challanNumber || "—"}
                          </Anchor>
                        )}

                        {current && (
                          <Badge size="xs" variant="filled">
                            Viewing
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>

                    <Table.Td>
                      <Text fz="sm" className="numeric">
                        {row.startDate
                          ? formatDate(row.startDate, "MMM YYYY")
                          : "—"}
                        {" – "}
                        {row.endDate
                          ? formatDate(row.endDate, "MMM YYYY")
                          : "Open"}
                      </Text>

                      {length && (
                        <Text fz="xs" c="dimmed">
                          {length}
                        </Text>
                      )}
                    </Table.Td>

                    <Table.Td>
                      {row.filingDate ? (
                        <Text fz="sm" className="numeric">
                          {formatDate(row.filingDate)}
                        </Text>
                      ) : (
                        <Badge size="xs" color="orange">
                          Not filed
                        </Badge>
                      )}
                    </Table.Td>

                    <Table.Td>
                      <PicklistBadge item={row.status} />
                    </Table.Td>

                    <Table.Td ta="right">
                      <Text fz="sm" fw={600} className="numeric">
                        {formatAmount(row.taxAmount || 0)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </DetailPanel>
  );
};

export default TaxHistory;
