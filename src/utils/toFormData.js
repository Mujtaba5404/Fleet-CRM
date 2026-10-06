/**
 * Builds a multipart body from flat form values plus picked files.
 *
 * null becomes "" so a cleared field is still sent (FormData would otherwise
 * stringify it to "null"), and dates go over as ISO strings.
 */
const toFormData = (values, files = [], fileField = "attachments") => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined) return;

    formData.append(
      key,
      value instanceof Date ? value.toISOString() : (value ?? ""),
    );
  });

  files.forEach((file) => formData.append(fileField, file));

  return formData;
};

export default toFormData;
