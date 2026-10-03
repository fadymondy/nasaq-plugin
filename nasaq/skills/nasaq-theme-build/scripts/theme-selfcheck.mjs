#!/usr/bin/env node
// Static self-check for a Nasaq Studio theme folder. No dependencies.
// Usage: node theme-selfcheck.mjs <theme-dir> [--json]
// Exit code 1 when any ERROR is found. WARNs must be justified in DESIGN.md.
// Manifest field names live in FIELD so they can follow the runtime contract.
import fs from 'node:fs';
import path from 'node:path';

const FIELD = {
  manifestFiles: ['manifest.json'],
  colors: (m) => m.tokens?.colors,
  coverage: (m) => m.coverage,
  previews: (m) => m.previews,
};
const ROLES = ['primary', 'accent', 'background', 'foreground', 'muted', 'border'];
const SRC_EXT = new Set(['.tsx', '.ts', '.jsx', '.js', '.css', '.html', '.json', '.mdx']);
const SKIP_DIR = new Set(['node_modules', '.next', 'dist', 'build', '.git', 'tests', '__snapshots__']);

const dir = process.argv[2];
const asJson = process.argv.includes('--json');
if (!dir || !fs.existsSync(dir)) { console.error('usage: theme-selfcheck.mjs <theme-dir>'); process.exit(2); }

const out = [];
const add = (level, rule, msg, file) => out.push({ level, rule, msg, file: file ? path.relative(dir, file) : '' });

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(path.join(d, e.name), acc); }
    else acc.push(path.join(d, e.name));
  }
  return acc;
}
const files = walk(dir);

// ---- colour maths
const hex = (s) => { const m = /^#([0-9a-f]{6})$/i.exec(s || ''); return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : null; };
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// ---- manifest
const mf = FIELD.manifestFiles.map((f) => path.join(dir, f)).find((f) => fs.existsSync(f));
let m = null;
if (!mf) add('ERROR', 'manifest', `no manifest (${FIELD.manifestFiles.join(' or ')})`);
else {
  try { m = JSON.parse(fs.readFileSync(mf, 'utf8')); } catch (e) { add('ERROR', 'manifest', 'invalid JSON: ' + e.message, mf); }
}
if (m) {
  if (!/^[a-z0-9-]{2,40}$/.test(m.id || '')) add('ERROR', 'manifest', 'id must match [a-z0-9-]{2,40}', mf);
  for (const k of ['name', 'description']) {
    if (!m[k]?.en || !m[k]?.ar) add('ERROR', 'manifest', `${k} needs en and ar`, mf);
  }
  if (!m.version) add('ERROR', 'manifest', 'version missing', mf);
  const cov = FIELD.coverage(m);
  if (!cov || !Object.keys(cov).length) add('ERROR', 'coverage', 'coverage missing', mf);
  const c = FIELD.colors(m);
  if (!c?.light || !c?.dark) add('ERROR', 'tokens', 'tokens.colors.light AND .dark are required', mf);
  else {
    for (const mode of ['light', 'dark']) {
      for (const r of ROLES) if (!hex(c[mode][r])) add('ERROR', 'tokens', `${mode}.${r} missing or not #RRGGBB`, mf);
      const bg = hex(c[mode].background), fg = hex(c[mode].foreground), pr = hex(c[mode].primary), ac = hex(c[mode].accent), mu = hex(c[mode].muted);
      if (bg && fg && ratio(bg, fg) < 4.5) add('ERROR', 'contrast', `${mode}: foreground/background ${ratio(bg, fg).toFixed(2)} < 4.5`, mf);
      if (bg && pr && ratio(bg, pr) < 4.5) add('WARN', 'contrast', `${mode}: primary on background ${ratio(bg, pr).toFixed(2)} < 4.5 (OK only if never used as text)`, mf);
      if (bg && ac && ratio(bg, ac) < 3) add('WARN', 'contrast', `${mode}: accent on background ${ratio(bg, ac).toFixed(2)} < 3 (do not use for text/UI)`, mf);
      if (mu && fg && ratio(mu, fg) < 4.5) add('ERROR', 'contrast', `${mode}: foreground on muted ${ratio(mu, fg).toFixed(2)} < 4.5`, mf);
      if (pr) {
        const on = hex(c[mode].onPrimary) || [255, 255, 255];
        if (ratio(pr, on) < 4.5) add('ERROR', 'contrast', `${mode}: text on primary ${ratio(pr, on).toFixed(2)} < 4.5 (set onPrimary)`, mf);
      }
    }
    if (c.light && c.dark && c.light.background === c.dark.background) add('ERROR', 'tokens', 'dark background equals light background', mf);
  }
  if (m.tokens?.fonts?.ar && m.tokens.fonts.ar !== 'Lusail') add('ERROR', 'fonts', 'Arabic font must be Lusail', mf);
  const pv = FIELD.previews(m) || {};
  const prevs = [pv.thumbnail, ...(pv.screens || [])].filter(Boolean);
  if (!pv.thumbnail || (pv.screens || []).length < 8) add('ERROR', 'previews', 'previews need a thumbnail and >= 8 screens (desktop+mobile x EN+AR x 2 pages), see reference/gate.md', mf);
  for (const p of prevs) {
    if (/\.svg(\?|$)/i.test(p)) add('ERROR', 'previews', `preview "${p}" is SVG; previews must be real rendered screenshots (webp/jpg/png)`, mf);
    else if (!/^https?:/.test(p) && !fs.existsSync(path.join(dir, p))) add('ERROR', 'previews', `preview file missing: ${p}`, mf);
    else if (!/^https?:/.test(p) && fs.statSync(path.join(dir, p)).size < 15000) add('WARN', 'previews', `preview ${p} is under 15KB; real screenshots are larger`, mf);
  }
  const hasLocalePair = ['en', 'ar'].every((l) => prevs.some((p) => new RegExp(`(^|[-_/.])${l}([-_/.]|$)`).test(p)));
  if (!hasLocalePair) add('ERROR', 'previews', 'previews must include EN and AR screenshots (name them *-en-*, *-ar-*)', mf);
  if (!['mobile', 'desktop'].every((v) => prevs.some((p) => p.includes(v)))) add('ERROR', 'previews', 'previews must include desktop and mobile screenshots (name contains "desktop"/"mobile")', mf);
  if (!fs.existsSync(path.join(dir, 'DESIGN.md'))) add('ERROR', 'process', 'DESIGN.md (art direction + rubric scores) missing');
}

// ---- tiny image placeholders in assets
for (const f of files) {
  if (/\.svg$/i.test(f) && /assets|previews|content/.test(f)) {
    const sz = fs.statSync(f).size;
    if (sz < 1500) add('ERROR', 'imagery', `SVG ${sz} bytes looks like placeholder art (circles/bars). Use real imagery`, f);
  }
}

// ---- source rules
const rules = [
  ['ERROR', 'rtl', /(?<![\w-])(margin|padding)-(left|right)\s*:/g, 'physical margin/padding; use margin-inline/padding-inline'],
  ['ERROR', 'rtl', /(?<![\w-])(left|right)\s*:\s*[-\d.]+(px|rem|em|%)?\s*[;}]/g, 'physical left/right offset; use inset-inline-start/end'],
  ['ERROR', 'rtl', /text-align\s*:\s*(left|right)/g, 'text-align left/right; use start/end'],
  ['ERROR', 'rtl', /border-(left|right)(-\w+)?\s*:/g, 'physical border side; use border-inline-*'],
  ['ERROR', 'rtl', /float\s*:\s*(left|right)/g, 'float left/right; use inline-start/end'],
  ['ERROR', 'rtl', /\b(?:ml|mr|pl|pr|left|right|text-left|text-right|rounded-l|rounded-r)-(?:\[?[\w.\/-]+\]?)/g, 'Tailwind physical utility; use ms/me/ps/pe/start/end/text-start/rounded-s', /\.(tsx|jsx|html|mdx)$/],
  ['ERROR', 'motion', /transition\s*:\s*all\b/g, 'transition: all'],
  ['ERROR', 'placeholder', /lorem ipsum|dolor sit amet|john doe|your text here|tell visitors what you do|a first post|another update|tips and tricks/gi, 'placeholder copy'],
  ['ERROR', 'dead-js', /href=["']#["']/g, 'href="#" dead link'],
  ['ERROR', 'dead-js', /onClick=\{\s*\(\)\s*=>\s*\{\s*\}\s*\}/g, 'empty onClick'],
  ['ERROR', 'dead-js', /onClick=\{\s*\(\)\s*=>\s*console\.\w+\([^)]*\)\s*\}/g, 'onClick that only logs'],
  ['WARN', 'debug', /console\.(log|debug)\(/g, 'console.log left in source', /\.(tsx|ts|jsx|js)$/],
  ['ERROR', 'nav', /<a\s[^>]*href=["']\/(?!\/)[^"']*["']/g, 'internal <a href>; use next/link', /\.(tsx|jsx)$/],
  ['WARN', 'nav', /window\.location(\.href)?\s*=/g, 'window.location navigation reloads the document', /\.(tsx|ts|jsx|js)$/],
  ['ERROR', 'images', /<img\s(?![^>]*\balt=)[^>]*>/g, '<img> without alt', /\.(tsx|jsx|html)$/],
  ['WARN', 'images', /<img\s/g, 'raw <img>; use next/image with sizes', /\.(tsx|jsx)$/],
  ['ERROR', 'a11y', /outline\s*:\s*(none|0)\b(?![^}]*(box-shadow|outline-offset|:focus-visible))/g, 'outline removed without replacement', /\.css$/],
  ['WARN', 'tokens', /(?<![-\w&])#[0-9a-fA-F]{6}\b/g, 'raw hex outside tokens; use var(--nq-*)', /\.(tsx|jsx)$/],
  ['WARN', 'fonts', /fonts\.googleapis\.com|fonts\.gstatic\.com/g, 'runtime Google Fonts; self-host'],
  ['WARN', 'a11y', /<div[^>]*onClick=/g, 'onClick on div; use button/a', /\.(tsx|jsx)$/],
];
const isTokensFile = (f) => /tokens\.css$|nasaq\.(theme|template)\.json$|previews|content[\\/]/.test(f);
let uses = { anim: false, reduced: false, link: false, image: false, bdi: false };
for (const f of files) {
  if (!SRC_EXT.has(path.extname(f))) continue;
  const txt = fs.readFileSync(f, 'utf8');
  if (/@keyframes|animation\s*:|motion\/react|framer-motion|IntersectionObserver|transition\s*:/.test(txt)) uses.anim = true;
  if (/prefers-reduced-motion|useReducedMotion/.test(txt)) uses.reduced = true;
  if (/next\/link|@nq\/client/.test(txt)) uses.link = true;
  if (/next\/image/.test(txt)) uses.image = true;
  for (const [lvl, rule, re, msg, only] of rules) {
    if (only && !only.test(f)) continue;
    if (rule === 'tokens' && isTokensFile(f)) continue;
    if (rule === 'placeholder' && /DESIGN\.md|selfcheck/.test(f)) continue;
    const matches = txt.match(re);
    if (matches) {
      const line = txt.slice(0, txt.search(re)).split('\n').length;
      add(lvl, rule, `${msg} (x${matches.length}, first at line ${line})`, f);
    }
  }
}
if (uses.anim && !uses.reduced) add('ERROR', 'motion', 'animations found but no prefers-reduced-motion / useReducedMotion handling anywhere');
if (!uses.link) add('ERROR', 'nav', 'no next/link usage: SPA navigation is mandatory');
if (!files.some((f) => /Header|header|nav/i.test(path.basename(f)))) add('WARN', 'structure', 'no header/nav component found');
if (!files.some((f) => /mobile[-_]?(nav|menu)|drawer/i.test(path.basename(f)))) add('ERROR', 'structure', 'no mobile nav/drawer component (MobileNav/MobileMenu/Drawer)');
if (!files.some((f) => /footer/i.test(path.basename(f)))) add('ERROR', 'structure', 'no footer component');
if (!files.some((f) => /not-found|404/i.test(path.basename(f)))) add('WARN', 'structure', 'no 404 template');
if (!files.some((f) => /theme[-_]?(toggle|switch)/i.test(path.basename(f)))) add('WARN', 'structure', 'no theme toggle component');
if (!files.some((f) => /(locale|lang)/i.test(path.basename(f)))) add('WARN', 'structure', 'no locale switch component');
if (!files.some((f) => /\.woff2$/i.test(f))) add('WARN', 'fonts', 'no self-hosted woff2 fonts in theme (Lusail subset expected)');

const errs = out.filter((o) => o.level === 'ERROR').length, warns = out.length - errs;
if (asJson) console.log(JSON.stringify({ errors: errs, warnings: warns, items: out }, null, 2));
else {
  for (const o of out.sort((a, b) => a.level.localeCompare(b.level))) console.log(`${o.level.padEnd(5)} [${o.rule}] ${o.msg}${o.file ? '  -> ' + o.file : ''}`);
  console.log(`\n${errs} error(s), ${warns} warning(s). ${errs ? 'FAIL: fix errors before the verification gate.' : 'Static check passed; now run the verification gate.'}`);
}
process.exit(errs ? 1 : 0);
