import {
  Alert,
  Button,
  CloseButton,
  Grid,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import classes from "./FormShell.module.css";

/**
 * The single presentation for every create and edit form in the CRM.
 *
 * Before this, fleet used a right drawer, maintenance and insurance used
 * fullscreen modals and tax used a centred modal — same action, four
 * different shapes. Everything now opens the same way: a wide modal with a
 * fixed header, a scrolling two-column body of section cards and a pinned
 * action bar. Fullscreen on phones, where a centred modal has nowhere to go.
 *
 * @param {Object}    props
 * @param {boolean}   props.opened
 * @param {Function}  props.onClose
 * @param {string}    props.title
 * @param {string}    [props.description]
 * @param {string}    props.submitLabel
 * @param {Function}  props.onSubmit        Already wrapped by form.onSubmit.
 * @param {boolean}   [props.isSubmitting]
 * @param {Error}     [props.error]         Surfaced at the end of the body.
 * @param {ReactNode} [props.aside]         Right hand column; when omitted the
 *   form is a single centred column.
 * @param {string}    [props.size]          Modal width on tablet and up.
 */
const FormShell = ({
  opened,
  onClose,
  title,
  description,
  submitLabel,
  onSubmit,
  isSubmitting = false,
  error,
  aside,
  size = "82rem",
  children,
}) => {
  const isMobile = useMediaQuery("(max-width: 48em)");

  const errorAlert = error ? (
    <Alert
      color="red"
      icon={<IconAlertCircle size={18} />}
      title="Could not save"
    >
      {error.message || "Something went wrong. Please try again."}
    </Alert>
  ) : null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen={isMobile}
      size={size}
      padding={0}
      radius={isMobile ? 0 : "md"}
      centered={false}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      // The theme centres modals and pads the body; this one owns its layout.
      styles={{
        inner: { padding: isMobile ? 0 : "3vh 1rem" },
        content: {
          display: "flex",
          flexDirection: "column",
          maxHeight: isMobile ? "100dvh" : "94vh",
        },
        body: { flex: 1, minHeight: 0, padding: 0 },
      }}
    >
      <form onSubmit={onSubmit} className={classes.form} noValidate>
        <div className={classes.header}>
          <div className={classes.headerText}>
            <Text fz="md" fw={650} lh={1.3}>
              {title}
            </Text>

            {description && (
              <Text fz="xs" c="dimmed" mt={2}>
                {description}
              </Text>
            )}
          </div>

          <CloseButton onClick={onClose} aria-label="Close" size="lg" />
        </div>

        <ScrollArea className={classes.body} scrollbars="y">
          <div className={classes.bodyInner}>
            {aside ? (
              <Grid gutter="md" align="flex-start">
                <Grid.Col span={{ base: 12, lg: 5 }}>
                  <Stack gap="md">{children}</Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 7 }}>
                  <Stack gap="md">
                    {aside}
                    {errorAlert}
                  </Stack>
                </Grid.Col>
              </Grid>
            ) : (
              <Stack gap="md" maw={720} mx="auto">
                {children}
                {errorAlert}
              </Stack>
            )}
          </div>
        </ScrollArea>

        <div className={classes.footer}>
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button type="submit" loading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FormShell;
