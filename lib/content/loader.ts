import fs from "node:fs";
import path from "node:path";
import { load as parseYaml } from "js-yaml";
import type { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Thrown when a content file is missing, malformed, or fails validation. */
export class ContentError extends Error {
  constructor(
    public readonly file: string,
    message: string,
  ) {
    super(`[content/${file}] ${message}`);
    this.name = "ContentError";
  }
}

// Parsed files are cached so each YAML file is read once per build process.
const cache = new Map<string, unknown>();

/**
 * Load and validate a YAML file from `content/`. Errors are formatted to be
 * readable by non-technical maintainers (they point at the exact field).
 */
export function loadYaml<S extends z.ZodTypeAny>(file: string, schema: S): z.infer<S> {
  if (cache.has(file)) {
    return cache.get(file) as z.infer<S>;
  }

  const filePath = path.join(CONTENT_DIR, file);
  if (!fs.existsSync(filePath)) {
    throw new ContentError(file, "file not found");
  }

  let raw: unknown;
  try {
    raw = parseYaml(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    throw new ContentError(
      file,
      `could not parse YAML — check indentation and quotes.\n${String(err)}`,
    );
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const where = issue.path.length ? issue.path.join(" → ") : "(top level)";
        return `  • ${where}: ${issue.message}`;
      })
      .join("\n");
    throw new ContentError(file, `validation failed:\n${details}`);
  }

  cache.set(file, result.data);
  return result.data;
}

/** Test helper / hot-reload escape hatch. */
export function clearContentCache(): void {
  cache.clear();
}
