import { NumberInput } from "@mantine/core";
import { CURRENCY_PREFIX } from "../utils/formatAmount";

/**
 * A NumberInput for an amount of money.
 *
 * Carries the currency prefix so a form field reads the same way as the value
 * it will later be displayed as. The prefix comes from `formatAmount`, so
 * switching the CRM's currency moves inputs and output together.
 */
const CurrencyInput = (props) => (
  <NumberInput
    prefix={CURRENCY_PREFIX}
    thousandSeparator=","
    hideControls
    min={0}
    {...props}
  />
);

export default CurrencyInput;
