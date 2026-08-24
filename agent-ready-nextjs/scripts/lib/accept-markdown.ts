/** Content negotiation helpers — acceptmarkdown.com compliant. */

export const MARKDOWN_PRODUCES = ["text/html", "text/markdown"] as const;

export interface AcceptEntry {
  q: number;
  specificity: number;
  type: string;
}

function acceptSpecificity(type: string): number {
  if (type === "*/*") {
    return 0;
  }
  if (type.endsWith("/*")) {
    return 1;
  }
  return 2;
}

export function parseAccept(header: string): AcceptEntry[] {
  return header.split(",").map((raw) => {
    const parts = raw
      .trim()
      .split(";")
      .map((s) => s.trim());
    const type = parts[0]?.toLowerCase() ?? "";
    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split("=").map((s) => s.trim());
      if (name === "q") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          q = Math.max(0, Math.min(1, parsed));
        }
      }
    }
    return { type, q, specificity: acceptSpecificity(type) };
  });
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === "*/*") {
    return true;
  }
  if (entry.type.endsWith("/*")) {
    return candidate.startsWith(entry.type.slice(0, -1));
  }
  return entry.type === candidate;
}

function bestMatchingEntry(
  entries: AcceptEntry[],
  candidate: string
): { entry: AcceptEntry; position: number } | null {
  let matched: AcceptEntry | null = null;
  let matchedPosition = Number.POSITIVE_INFINITY;

  for (let idx = 0; idx < entries.length; idx++) {
    const entry = entries[idx];
    if (!(entry && matches(entry, candidate))) {
      continue;
    }
    if (
      matched === null ||
      entry.specificity > matched.specificity ||
      (entry.specificity === matched.specificity && idx < matchedPosition)
    ) {
      matched = entry;
      matchedPosition = idx;
    }
  }

  if (matched === null || matched.q <= 0) {
    return null;
  }

  return { entry: matched, position: matchedPosition };
}

/** RFC 9110 §12.5.1 — specific ranges override wildcards regardless of q. */
export function preferredType(
  header: string | null,
  produces: readonly string[] = MARKDOWN_PRODUCES
): string | null {
  if (!header) {
    return produces[0] ?? null;
  }

  const entries = parseAccept(header);
  if (entries.length === 0) {
    return produces[0] ?? null;
  }

  let bestType: string | null = null;
  let bestQ = -1;
  let bestPosition = Number.POSITIVE_INFINITY;

  for (const candidate of produces) {
    const match = bestMatchingEntry(entries, candidate);
    if (!match) {
      continue;
    }

    if (
      match.entry.q > bestQ ||
      (match.entry.q === bestQ && match.position < bestPosition)
    ) {
      bestQ = match.entry.q;
      bestPosition = match.position;
      bestType = candidate;
    }
  }

  return bestType;
}

export function wantsMarkdown(acceptHeader: string | null): boolean {
  return preferredType(acceptHeader) === "text/markdown";
}

export function appendVaryAccept(headers: Headers): void {
  const existing = headers.get("Vary");
  const needed = ["Accept", "Accept-Encoding"];

  if (!existing) {
    headers.set("Vary", needed.join(", "));
    return;
  }

  const tokens = existing.split(",").map((s) => s.trim().toLowerCase());
  const toAdd = needed.filter((name) => !tokens.includes(name.toLowerCase()));
  if (toAdd.length > 0) {
    headers.set("Vary", `${existing}, ${toAdd.join(", ")}`);
  }
}

export const markdownResponseHeaders = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept, Accept-Encoding",
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
} as const;
