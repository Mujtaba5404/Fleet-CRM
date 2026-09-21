import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

dayjs.extend(utc);

const isEmpty = (value) => {
  if (value == null || value === "") return true;

  if (Array.isArray(value)) return value.length === 0;

  return false;
};

const isDateString = (value) => {
  if (typeof value !== "string") return false;

  // Strict ISO 8601 format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

  return isoDateRegex.test(value) && !isNaN(new Date(value).getTime());
};

const parseDatesDeep = (value) => {
  if (Array.isArray(value)) return value.map(parseDatesDeep);

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, parseDatesDeep(v)]));
  }

  if (isDateString(value)) {
    return dayjs.utc(value, "YYYY-MM-DD").toDate();
  }

  return value;
};

const serializeDatesDeep = (value) => {
  if (Array.isArray(value)) return value.map(serializeDatesDeep);

  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serializeDatesDeep(v)]));
  }

  if (value instanceof Date) {
    return dayjs(value).utc(true).format("YYYY-MM-DD");
  }

  return value;
};

/**
 * Custom hook for managing URL-synced filters.
 *
 * Enhancements:
 * - Automatically parses JSON values from query params
 * - Parses date strings → Date instances for UI components
 * - Serializes Date instances → YYYY-MM-DD strings for URL
 * - Handles primitives, arrays, and objects seamlessly
 *
 * @param {Object} initialFilters - Default filter values (optional)
 *
 * @returns {{
 *   filters: Object,                         // Current filter values
 *   setFilters: (updates: Object) => void,   // Update one or more filters
 *   resetFilters: () => void                 // Reset filters to initial defaults
 * }}
 *
 * @example
 * const { filters, setFilters, resetFilters } = useFilters({
 *   startDate: [null, null],
 *   status: [],
 * });
 *
 * setFilters({
 *   startDate: [new Date(), null],
 *   status: ["active"],
 * });
 *
 * resetFilters();
 */
const useFilters = (initialFilters = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const result = { ...initialFilters };

    for (const [key, value] of searchParams.entries()) {
      try {
        const parsed = JSON.parse(value);
        result[key] = parseDatesDeep(parsed);
      } catch {
        result[key] = value;
      }
    }

    return result;
  }, [searchParams, initialFilters]);

  const setFilters = (updates = {}) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (isEmpty(value)) {
        newParams.delete(key);
      } else {
        const serialized = serializeDatesDeep(value);
        newParams.set(key, JSON.stringify(serialized));
      }
    });

    setSearchParams(newParams);
  };

  const resetFilters = () => {
    const newParams = new URLSearchParams();

    Object.entries(initialFilters).forEach(([key, value]) => {
      if (!isEmpty(value)) {
        newParams.set(key, JSON.stringify(serializeDatesDeep(value)));
      }
    });

    setSearchParams(newParams);
  };

  return { filters, setFilters, resetFilters };
};

export default useFilters;
