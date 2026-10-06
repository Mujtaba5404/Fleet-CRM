import { Loader } from "@mantine/core";
import { useGetAllfleetsQuery } from "../../api/fleet";
import Select from "../../components/Select";

// "ABC1234 · toyota corolla 2026" — the plate is what people search by.
const toLabel = ({ licensePlate, make, model, year }) =>
  [licensePlate, [make?.title, model?.title, year].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(" · ");

const FleetsSelect = ({ selectProps = {}, queryObject = {} }) => {
  const fleets = useGetAllfleetsQuery({ query: queryObject });

  return (
    <Select
      data={fleets.data?.map((fleet) => ({ ...fleet, label: toLabel(fleet) }))}
      selectLabel="label"
      selectValue="_id"
      searchable
      clearable
      rightSection={fleets.isLoading && <Loader size={18} />}
      {...selectProps}
      {...(fleets.isSuccess &&
        !fleets.data?.length && {
          placeholder: "No vehicles yet — add one under Vehicles first",
          nothingFoundMessage: "No vehicles yet",
        })}
      {...(fleets.isError && {
        disabled: true,
        placeholder: "Error loading vehicles",
      })}
    />
  );
};

export default FleetsSelect;
