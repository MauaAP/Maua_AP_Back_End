/**
 * Persistência: string CSV (vírgula), alinhada a html_certificate split(",").
 */
export function normalizeDevelopedCompetencies(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((s) => s.length > 0)
      .join(", ");
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return String(value).trim();
}
