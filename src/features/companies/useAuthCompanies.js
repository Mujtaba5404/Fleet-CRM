import { useLocalStorage } from "@mantine/hooks";
import { useMemo } from "react";

/**
 * One company from the login payload as `{ _id, title, ... }`.
 *
 * Accepts a company object (`_id`/`id`, `title`/`name`), a membership wrapping
 * one (`{ company: {...} }`) or a bare id.
 */
const toCompany = (entry) => {
  if (!entry) return null;
  if (typeof entry === "string") return { _id: entry, title: entry };

  const company =
    entry.company && typeof entry.company === "object" ? entry.company : entry;
  const _id = company._id ?? company.id;

  if (!_id) return null;

  return {
    ...company,
    _id,
    title: company.title ?? company.name ?? company.acronym ?? _id,
  };
};

/**
 * The companies the signed-in user belongs to, straight from the session the
 * login call returned. There is no companies endpoint on the fleet API; this
 * list is the source for every company select.
 */
const useAuthCompanies = () => {
  const [auth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });

  const raw = auth?.companies ?? auth?.user?.companies;

  return useMemo(() => {
    const seen = new Set();

    return (Array.isArray(raw) ? raw : []).map(toCompany).filter((company) => {
      if (!company || seen.has(company._id)) return false;
      seen.add(company._id);
      return true;
    });
  }, [raw]);
};

export default useAuthCompanies;
