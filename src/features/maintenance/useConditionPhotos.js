import { useState } from "react";

const EMPTY = { conditionBefore: [], conditionAfter: [] };

/**
 * Newly picked before / after photos for a maintenance form. Files are not
 * form values; they are appended to the multipart body on submit.
 *
 * @param {string} [seed] Changing it drops the picks. It is compared during
 *   render rather than in an effect, so reopening never flashes the previous
 *   session's photos.
 */
const useConditionPhotos = (seed) => {
  const [lastSeed, setLastSeed] = useState(seed);
  const [photos, setPhotos] = useState(EMPTY);

  if (seed !== lastSeed) {
    setLastSeed(seed);
    setPhotos(EMPTY);
  }

  const setPhotoField = (field, files) =>
    setPhotos((current) => ({ ...current, [field]: files }));

  const resetPhotos = () => setPhotos(EMPTY);

  return { photos, setPhotoField, resetPhotos };
};

export default useConditionPhotos;
