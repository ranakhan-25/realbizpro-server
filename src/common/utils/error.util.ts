export function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (
    typeof error === 'number' ||
    typeof error === 'boolean' ||
    typeof error === 'bigint'
  ) {
    return String(error);
  }

  if (error === null) {
    return 'null';
  }

  if (error === undefined) {
    return 'undefined';
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return 'Unable to stringify error';
  }
}
