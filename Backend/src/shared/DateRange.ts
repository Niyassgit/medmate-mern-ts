export const getDateRange = (startDate?: string, endDate?: string) => {
  const now = new Date();

  const parsedStartDate = startDate
    ? new Date(startDate)
    : new Date(now.getFullYear(), 0, 1);

  const parsedEndDate = endDate
    ? new Date(endDate)
    : new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  return { parsedStartDate, parsedEndDate };
};
