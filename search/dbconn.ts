import { connect } from '@tursodatabase/serverless';

const dbUrl = process.env.EXPO_PUBLIC_TURSO_DB_URL;
const authToken = process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN;

const db = connect({
  url: dbUrl,
  authToken,
});

// Convert each bound parameter into the JSON shape Turso expects.
// This keeps numbers, booleans, strings, and null values in a format the server understands.
const encodeValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return { type: 'null' };
  }

  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { type: 'integer', value: value.toString() }
      : { type: 'float', value };
  }

  if (typeof value === 'boolean') {
    return { type: 'integer', value: value ? '1' : '0' };
  }

  if (typeof value === 'string') {
    return { type: 'text', value };
  }

  // Fallback for anything else so the request still serializes safely.
  return { type: 'text', value: String(value) };
};

// Decode a Turso value back into a plain JavaScript value.
// This is used after the response comes back so the app can work with normal objects/values.
const decodeValue = (value: any) => {
  if (!value) {
    return null;
  }

  switch (value.type) {
    case 'null':
      return null;
    case 'integer':
      return Number(value.value);
    case 'float':
      return value.value;
    case 'text':
      return value.value;
    default:
      return value.value ?? null;
  }
};

// Run a SQL statement against the Turso database and return rows as plain objects.
// This is a manual wrapper around the cursor endpoint so it works more reliably in Expo/React Native.
export const queryTurso = async (sql: string, params: Array<string | number> = []) => {
  // Guard early if the environment variables are missing.
  // Without a URL and auth token, there is nothing to send to Turso.
  if (!dbUrl || !authToken) {
    throw new Error('Turso connection details are not configured.');
  }

  // Turso uses a https:// URL, but the config may be stored as libsql://.
  // This normalizes the URL so fetch can hit the correct endpoint.
  const normalizedUrl = dbUrl.replace(/^libsql:\/\//, 'https://');

  // Build the cursor request body.
  // The request is wrapped in a batch with a single statement so Turso can return rows.
  const requestBody = {
    baton: null,
    batch: {
      steps: [
        {
          stmt: {
            sql,
            // Convert each parameter into the structured value format Turso expects.
            args: params.map(encodeValue),
            // Ask for rows back in the response.
            want_rows: true,
          },
        },
      ],
    },
  };

  // Send the request to Turso's cursor endpoint.
  const response = await fetch(`${normalizedUrl}/v3/cursor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  // Fail fast if the request was not successful.
  // This surfaces API/auth issues clearly instead of returning a blank response.
  if (!response.ok) {
    let message = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      message = errorData.error || errorData.message || message;
    } catch {
      // Ignore JSON parse errors and fall back to the HTTP status message.
    }

    throw new Error(message);
  }

  // Read the response as a plain text body because the cursor endpoint streams newline-delimited JSON.
  const text = await response.text();
  const lines = text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows: Record<string, unknown>[] = [];
  let columns: string[] = [];

  // Parse each newline-delimited JSON entry.
  // step_begin tells us the column names, and row entries contain the values for each record.
  for (const line of lines) {
    const entry = JSON.parse(line);

    if (entry.type === 'step_begin' && entry.cols) {
      columns = entry.cols.map((col: { name: string }) => col.name);
      continue;
    }

    if (entry.type === 'row' && entry.row) {
      const decodedRow = entry.row.map(decodeValue);
      const mappedRow = Object.fromEntries(
        columns.map((columnName, index) => [columnName, decodedRow[index]])
      );
      rows.push(mappedRow);
      continue;
    }

    if (entry.type === 'error') {
      throw new Error(entry.error?.message || 'SQL execution failed');
    }
  }

  // Return the rows as normal objects the calling code can use.
  return rows;
};

export default db