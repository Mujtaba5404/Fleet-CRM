import { ActionIcon, Avatar, Badge, Button, Drawer, Loader, Modal, MultiSelect, NumberInput, Paper, Popover, Select, Tabs, TagsInput, Tooltip } from "@mantine/core";
import { DatePicker, MonthPicker } from "@mantine/dates";

export default {
  colors: {
    dark: ["#f3f4f6", "#e5e7eb", "#a1a5ab", "#3f4a5d", "#374151", "#4b5563", "#1f2937", "#111827", "#111827", "#030712"],
  },
  cursorType: "pointer",
  defaultRadius: "md",
  fontFamily: "Inter, sans-serif",
  components: {
    ActionIcon: ActionIcon.extend({ defaultProps: { variant: "subtle" } }),
    Avatar: Avatar.extend({ defaultProps: { radius: "md" }, styles: { image: { objectFit: "contain" } } }),
    Badge: Badge.extend({ defaultProps: { variant: "light" } }),
    Button: Button.extend({ defaultProps: { miw: "max-content" } }),
    DatePicker: DatePicker.extend({ defaultProps: { allowSingleDateInRange: true } }),
    Drawer: Drawer.extend({ defaultProps: { position: "right", styles: { content: { display: "flex", flexDirection: "column" }, body: { height: "100%" } }, overlayProps: { blur: 2 } } }),
    Loader: Loader.extend({ defaultProps: { type: "dots", mx: "auto" } }),
    Paper: Paper.extend({ defaultProps: { withBorder: true } }),
    Modal: Modal.extend({ defaultProps: { centered: true, overlayProps: { blur: 2 } } }),
    MonthPicker: MonthPicker.extend({ defaultProps: { allowSingleDateInRange: true } }),
    MultiSelect: MultiSelect.extend({
      defaultProps: { hidePickedOptions: true, checkIconPosition: "right", searchable: true, clearable: true, limit: 20, nothingFoundMessage: "No results found", comboboxProps: { shadow: "md" } },
    }),
    NumberInput: NumberInput.extend({ defaultProps: { min: 0, allowNegative: false, thousandSeparator: true } }),
    Popover: Popover.extend({ defaultProps: { withArrow: true, shadow: "md" } }),
    Select: Select.extend({
      defaultProps: { allowDeselect: false, checkIconPosition: "right", searchable: true, limit: 20, nothingFoundMessage: "No results found", comboboxProps: { shadow: "md" } },
    }),
    Tabs: Tabs.extend({ defaultProps: { keepMounted: false } }),
    TagsInput: TagsInput.extend({ defaultProps: { acceptValueOnBlur: true, limit: 20, comboboxProps: { shadow: "md" } } }),
    Tooltip: Tooltip.extend({ defaultProps: { multiline: true, withArrow: true } }),
  },
};
