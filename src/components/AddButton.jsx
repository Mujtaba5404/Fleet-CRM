import { Button, Group, Text, ThemeIcon } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

const AddButton = ({ title = "", subtitle = "", ...props }) => {
  return (
    <Button variant="default" h={"auto"} p={"sm"} mih={"100%"} {...props}>
      <Group gap={"sm"} ta={"left"}>
        <ThemeIcon size={"lg"}>
          <IconPlus size={18} />
        </ThemeIcon>

        {(title || subtitle) && (
          <div>
            {title && (
              <Text fw={500} tt={"capitalize"}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text size="xs" c={"dimmed"}>
                {upperFirst(subtitle)}
              </Text>
            )}
          </div>
        )}
      </Group>
    </Button>
  );
};

export default AddButton;
