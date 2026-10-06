import { Select as MantineSelect } from "@mantine/core";
import _ from "lodash";
import capitalizeLetters from "../utils/capitalizeLetters";

const Select = ({
  data = [],
  selectLabel = "",
  selectValue = "",
  capitalizeLabel = true,
  groupBy = "",
  value,
  ...props
}) => {
  const formattedData = () => {
    if (groupBy) {
      return _.chain(data)
        .groupBy(groupBy)
        .map((items, group) => ({
          group: capitalizeLetters(group),
          items: items.map((e) => ({
            label: capitalizeLabel
              ? capitalizeLetters(e[selectLabel])
              : e[selectLabel],
            value: e[selectValue],
          })),
        }))
        .value();
    }

    return data.map((e) => ({
      label: capitalizeLabel
        ? capitalizeLetters(e[selectLabel])
        : e[selectLabel],
      value: e[selectValue],
    }));
  };

  const _data = formattedData();

  // Mantine only treats null as empty: "" still shows the clear button.
  return (
    <MantineSelect
      data={_data}
      value={value === "" ? null : value}
      {...props}
    />
  );
};

export default Select;
