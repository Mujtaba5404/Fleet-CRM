import { Select as MantineSelect } from "@mantine/core";
import _ from "lodash";
import capitalizeLetters from "../utils/capitalizeLetters";

const Select = ({
  data = [],
  selectLabel = "",
  selectValue = "",
  capitalizeLabel = true,
  groupBy = "",
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

  return <MantineSelect data={_data} {...props} />;
};

export default Select;
