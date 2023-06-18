export const toDateString = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { timeZone: "UTC" });
};
