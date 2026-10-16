import toFileUrl from "../../utils/toFileUrl";

const IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i;

export const fileName = (file) =>
  (typeof file === "string" ? file : file?.originalName || file?.filePath || "")
    .split(/[\\/]/)
    .pop() || "File";

export const fileExtension = (file) =>
  fileName(file).split(".").pop()?.toLowerCase() || "";

// Documents accept images too, so decide by mime type or extension.
export const isImage = (file) =>
  file?.mimeType?.startsWith?.("image/") ||
  file?.mimetype?.startsWith?.("image/") ||
  IMAGE_EXTENSION.test(fileName(file));

/** A vehicle's saved images and documents, images first, without empty paths. */
export const fleetFiles = ({ images = [], documents = [] } = {}) =>
  [...images, ...documents].filter((file) => toFileUrl(file));
