import { Button, Container, Stack, Text, Title, rem } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container component={Stack} gap={0} size={"xl"} mih={"100vh"} align="flex-start" justify="center" className="pattern-bg">
      <Stack gap={0} align="center" justify="center">
        <Title size={rem(72)}>404</Title>

        <Text tt={"uppercase"} fw={700} style={{ letterSpacing: rem(6) }}>
          Page not found
        </Text>

        <Button leftSection={<IconArrowLeft size={18} />} mt={"xl"} onClick={() => navigate(-1)}>
          Go back
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFound;
