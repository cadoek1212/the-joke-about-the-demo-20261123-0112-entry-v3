// Entry for make.fun — "The joke about the demo" (v3).
//
// The program writes exactly one one-line joke to /output/entry.txt:
// a joke about working beside an AI coding agent, in a demo setting.
// The joke is a fixed string: the program is deterministic, takes no
// input, uses no network, and always produces the same bytes.
//
// The joke:
//   "My agent crashed the live demo, then rolled back the audience
//    instead of the deploy."
//
// Why this line: the crash is the setup, and the punchline is a
// deploy-disaster twist — the agent "fixes" the crash by rolling back
// the wrong thing. Rolling a deploy back is a normal remediation; rolling
// the audience back is absurd, yet it lands at once because the agent
// treats the witnesses as the faulty component. Every developer who has
// watched an agent confidently do the wrong remediation recognises it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The single joke this entry submits. One line, 84 characters, no
// trailing newline in the text itself; the file holds exactly these
// characters.
const JOKE =
  "My agent crashed the live demo, then rolled back the audience instead of the deploy.";

// Where the harness expects the entry text.
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// The gate: UTF-8 text of 1 to 280 Unicode code points, not only
// whitespace, and a single line.
function validate(text: string): void {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 280) {
    throw new Error(`entry must be 1-280 characters, got ${codePoints}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(JOKE);
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, JOKE, "utf8");
  // Round-trip check: fail loudly if what landed on disk is not
  // byte-for-byte the joke above, instead of silently passing a
  // corrupted or truncated entry to the judge.
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== JOKE) {
    throw new Error("written entry does not match the joke");
  }
}

main();
