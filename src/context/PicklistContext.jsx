/**
 * @typedef {Object} PicklistContextValue
 * @property {string} featureName
 * @property {string} scope
 * @property {string} resource
 * @property {string} field
 * @property {import("@mantine/form").UseFormReturnType<any>} form
 * @property {boolean} isOpened
 * @property {() => void} openCreateModal
 * @property {(picklist: any) => void} openEditModal
 * @property {() => void} closeModal
 * @property {any|null} existingPicklist
 */

import { createContext, useContext } from "react";

/** @type {import("react").Context<PicklistContextValue|null>} */
const PicklistContext = createContext(null);

export const usePicklists = () => {
  const ctx = useContext(PicklistContext);

  if (!ctx) throw new Error("usePicklists must be used within PicklistProvider");

  return ctx;
};

export default PicklistContext;
