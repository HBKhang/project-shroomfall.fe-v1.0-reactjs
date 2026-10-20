export const enumToString = <T extends object>(
  enumObject: T,
  value: number | string | null | undefined,
  fallback?: string
): string => {

  if (value === null || value === undefined) {
    return fallback ?? Object.values(enumObject)[0] as string;
  }

  // Already string enum
  if (typeof value === "string") {
    return value;
  }

  // Numeric enum from backend
  return (
    Object.values(enumObject)[value] ??
    fallback ??
    Object.values(enumObject)[0]
  ) as string;
};


export const enumToIndex = <T extends object>(
  enumObject: T,
  value: string | null | undefined
): number => {

  if (!value) return 0;

  const index = Object.values(enumObject).indexOf(value);

  return index >= 0 ? index : 0;
};