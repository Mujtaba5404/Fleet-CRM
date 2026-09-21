const capitalizeLetters = (string = "") => {
  return string.replace(/\b\w/g, (c) => c.toUpperCase());
};

export default capitalizeLetters;
