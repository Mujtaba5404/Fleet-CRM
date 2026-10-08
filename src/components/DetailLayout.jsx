import { Grid } from "@mantine/core";

/**
 * Main content on the left, the properties card on the right. On phones the
 * two stack; `asideFirst` puts the properties on top there.
 */
const DetailLayout = ({ main, aside, asideFirst = false }) => (
  <Grid gutter="md" align="flex-start">
    <Grid.Col
      span={{ base: 12, lg: 8 }}
      order={{ base: asideFirst ? 2 : 1, lg: 1 }}
    >
      {main}
    </Grid.Col>

    <Grid.Col
      span={{ base: 12, lg: 4 }}
      order={{ base: asideFirst ? 1 : 2, lg: 2 }}
    >
      {aside}
    </Grid.Col>
  </Grid>
);

export default DetailLayout;
