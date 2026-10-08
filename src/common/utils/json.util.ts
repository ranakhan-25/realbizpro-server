export function toJson(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value));
}
