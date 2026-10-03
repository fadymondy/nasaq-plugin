#!/usr/bin/env node
// Verifies that every cms_* tool name mentioned in the plugin docs exists in scripts/tools.json.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const known = new Set(JSON.parse(readFileSync(join(root, "scripts", "tools.json"), "utf8")));

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(md|json|toml)$/.test(name) && !p.endsWith("tools.json")) out.push(p);
  }
  return out;
}

let bad = 0;
const used = new Set();
for (const file of walk(root)) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/\bcms_[a-z0-9_]+/g)) {
    used.add(m[0]);
    if (!known.has(m[0])) {
      bad++;
      console.error(`unknown tool ${m[0]} in ${file.slice(root.length + 1)}`);
    }
  }
}
const unused = [...known].filter((t) => !used.has(t));
console.log(`${used.size} tool names referenced, ${known.size} known, ${unused.length} not mentioned in docs`);
if (unused.length) console.log("not mentioned: " + unused.join(", "));
process.exit(bad ? 1 : 0);
