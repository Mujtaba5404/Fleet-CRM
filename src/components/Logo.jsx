import { Image, useMantineColorScheme } from "@mantine/core";
import fleetlogo from "../assets/fleetlogo.png";

const Logo = (props) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Image
      src={fleetlogo}
      styles={{
        root: {
          filter: colorScheme === "dark" ? "grayscale() invert()" : null,
        },
      }}
      {...props}
    />
  );
};

export default Logo;
