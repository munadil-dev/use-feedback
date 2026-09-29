-- Backfill from the cuid, which starts with the creation time in ms (base36)
UPDATE "Product"
SET "createdAt" = to_timestamp((
  SELECT sum((strpos('0123456789abcdefghijklmnopqrstuvwxyz', substr("id", i + 1, 1)) - 1) * power(36, 8 - i))
  FROM generate_series(1, 8) AS i
) / 1000.0) AT TIME ZONE 'UTC'
WHERE "id" ~ '^c[0-9a-z]{24}$';
