import {
  ActionIcon,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Drawer,
  Loader,
  Menu,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  Popover,
  Select,
  Tabs,
  TagsInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { DatePicker, MonthPicker } from "@mantine/dates";

export default {
  primaryColor: "brand",
  primaryShade: { light: 6, dark: 7 },
  colors: {
    // Sampled from the FleetCRM logo so the UI and the wordmark agree.
    brand: [
      "#eff6ff",
      "#dbeafe",
      "#bfdbfe",
      "#93c5fd",
      "#60a5fa",
      "#3b82f6",
      "#2563eb",
      "#1d4ed8",
      "#1e40af",
      "#1e3a8a",
    ],
    dark: [
      "#f3f4f6",
      "#e5e7eb",
      "#a1a5ab",
      "#3f4a5d",
      "#374151",
      "#4b5563",
      "#1f2937",
      "#111827",
      "#111827",
      "#030712",
    ],
  },
  cursorType: "pointer",
  defaultRadius: "md",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  headings: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    fontWeight: "650",
    sizes: {
      h1: { fontSize: "1.75rem", lineHeight: "1.25" },
      h2: { fontSize: "1.375rem", lineHeight: "1.3" },
      h3: { fontSize: "1.125rem", lineHeight: "1.35" },
      h4: { fontSize: "1rem", lineHeight: "1.4" },
      h5: { fontSize: "0.875rem", lineHeight: "1.4" },
    },
  },
  shadows: {
    xs: "0 1px 2px rgba(15, 23, 42, 0.06)",
    sm: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
    md: "0 4px 12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)",
    lg: "0 12px 28px rgba(15, 23, 42, 0.10), 0 2px 6px rgba(15, 23, 42, 0.04)",
    xl: "0 24px 48px rgba(15, 23, 42, 0.14)",
  },
  components: {
    ActionIcon: ActionIcon.extend({ defaultProps: { variant: "subtle" } }),
    Alert: Alert.extend({ defaultProps: { variant: "light", radius: "md" } }),
    Anchor: Anchor.extend({ defaultProps: { underline: "never" } }),
    Avatar: Avatar.extend({
      defaultProps: { radius: "md" },
      styles: { image: { objectFit: "contain" } },
    }),
    Badge: Badge.extend({ defaultProps: { variant: "light" } }),
    Breadcrumbs: Breadcrumbs.extend({
      defaultProps: { separator: "/" },
      styles: { separator: { color: "var(--mantine-color-dimmed)" } },
    }),
    Button: Button.extend({ defaultProps: { miw: "max-content" } }),
    Card: Card.extend({ defaultProps: { withBorder: true, radius: "md" } }),
    DatePicker: DatePicker.extend({
      defaultProps: { allowSingleDateInRange: true },
    }),
    Drawer: Drawer.extend({
      defaultProps: {
        position: "right",
        styles: {
          content: { display: "flex", flexDirection: "column" },
          body: { height: "100%" },
        },
        overlayProps: { blur: 2 },
      },
    }),
    Loader: Loader.extend({ defaultProps: { type: "dots", mx: "auto" } }),
    Menu: Menu.extend({ defaultProps: { shadow: "md", radius: "md" } }),
    Modal: Modal.extend({
      defaultProps: { centered: true, overlayProps: { blur: 2 } },
    }),
    MonthPicker: MonthPicker.extend({
      defaultProps: { allowSingleDateInRange: true },
    }),
    MultiSelect: MultiSelect.extend({
      defaultProps: {
        hidePickedOptions: true,
        checkIconPosition: "right",
        searchable: true,
        clearable: true,
        limit: 20,
        nothingFoundMessage: "No results found",
        comboboxProps: { shadow: "md" },
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: { min: 0, allowNegative: false, thousandSeparator: true },
    }),
    Paper: Paper.extend({ defaultProps: { withBorder: true, radius: "md" } }),
    Popover: Popover.extend({
      defaultProps: { withArrow: true, shadow: "md" },
    }),
    Select: Select.extend({
      defaultProps: {
        allowDeselect: false,
        checkIconPosition: "right",
        searchable: true,
        limit: 20,
        nothingFoundMessage: "No results found",
        comboboxProps: { shadow: "md" },
      },
    }),
    Tabs: Tabs.extend({ defaultProps: { keepMounted: false } }),
    TagsInput: TagsInput.extend({
      defaultProps: {
        acceptValueOnBlur: true,
        limit: 20,
        comboboxProps: { shadow: "md" },
      },
    }),
    Title: Title.extend({ defaultProps: { fw: 650 } }),
    Tooltip: Tooltip.extend({
      defaultProps: { multiline: true, withArrow: true },
    }),
  },
};
