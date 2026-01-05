
export const safeStringify = (value: unknown): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
    return value[0];
  }

  return undefined;
};


export const safeNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  if (Array.isArray(value) && value.length > 0) {
    return safeNumber(value[0]);
  }

  return undefined;
};


export const safeStringArray = (value: unknown): string[] | undefined => {
  const stringValue = safeStringify(value);
  if (!stringValue) {
    return undefined;
  }

  return stringValue.split(",").filter((item) => item.trim() !== "");
};


export const safeQueryParam = (
  value: unknown,
  split?: boolean
): string | string[] | undefined => {
  if (split) {
    return safeStringArray(value);
  }
  return safeStringify(value);
};

