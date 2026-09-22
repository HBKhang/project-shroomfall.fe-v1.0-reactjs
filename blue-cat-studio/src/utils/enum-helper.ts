type EnumLike = Record<string, string | number>;

const enumValues = (enumObject: EnumLike): Array<string | number> =>
  (() => {
    const values = Object.values(enumObject);
    return values.some((value) => typeof value === "number")
      ? values.filter((value): value is string => typeof value === "string")
      : values;
  })();

/** Converts an API enum ordinal or enum value to its display string. */
export const enumToString = (
  enumObject: EnumLike,
  value: string | number | null | undefined,
  fallback = "",
): string => {
  if (value === null || value === undefined) return fallback;

  const values = enumValues(enumObject);
  if (typeof value === "number") {
    const resolvedValue = values[value];
    return typeof resolvedValue === "string" ? resolvedValue : fallback;
  }

  return values.includes(value) ? value : fallback;
};

/** Converts an enum value selected in the UI to the ordinal expected by the API. */
export const enumToIndex = (
  enumObject: EnumLike,
  value: string | number | null | undefined,
): number | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number") return value;

  const index = enumValues(enumObject).indexOf(value);
  return index === -1 ? undefined : index;
};
