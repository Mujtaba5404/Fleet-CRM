/** The title of a populated picklist reference, or null for an id / nothing. */
const picklistTitle = (value) =>
  typeof value === "object" && value?.title ? value.title : null;

export default picklistTitle;
