import { Paper, Text } from "@mantine/core";

const Placeholder = ({ title = "", icon }) => {
  return (
    <Paper w={"100%"} p={"md"} ta={"center"} c={"dimmed"}>
      {icon}

      <Text size="lg">{title}</Text>
    </Paper>
  );
};

export default Placeholder;
