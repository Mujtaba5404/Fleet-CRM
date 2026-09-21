import { TagsInput as MantineTagInput } from "@mantine/core";
import _ from "lodash";
import capitalizeLetters from "src/utils/capitalizeLetters";

const TagsInput = ({ data = [], selectLabel = "", capitalizeLabel = true, groupBy = "", ...props }) => {
  const formattedData = () => {
    if (groupBy) {
      return _.chain(data)
        .groupBy(groupBy)
        .map((items, group) => ({
          group: capitalizeLetters(group),
          items: items.map((e) => (capitalizeLabel ? capitalizeLetters(e[selectLabel]) : e[selectLabel])),
        }))
        .value();
    }

    return data.map((e) => (capitalizeLabel ? capitalizeLetters(e[selectLabel]) : e[selectLabel]));
  };

  const _data = formattedData();

  return <MantineTagInput data={_data} {...props} />;
};

export default TagsInput;
