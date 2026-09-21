import { Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { Children, Fragment } from "react";
import classes from "../index.module.css";

const InfoList = ({ children, ...props }) => {
  const items = Children.toArray(children);

  return (
    <Paper p="md" tt={"capitalize"} {...props}>
      <Stack>
        {items.map((item, index) => (
          <Fragment key={index}>
            {item}

            {index !== items.length - 1 && <Divider />}
          </Fragment>
        ))}
      </Stack>
    </Paper>
  );
};

InfoList.Item = ({ icon, label, fallback = "-", children }) => {
  const content = children || fallback;

  return (
    <Group>
      {icon && (
        <div className={classes.icon} size={18}>
          {icon}
        </div>
      )}

      <Stack gap={0}>
        <Text size="xs" c={"dimmed"}>
          {label}
        </Text>

        {typeof content === "string" ? <Text size="sm">{content}</Text> : content}
      </Stack>
    </Group>
  );
};

export default InfoList;
