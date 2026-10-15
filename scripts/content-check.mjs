#!/usr/bin/env node
/**
 * Validates content/site.json against content/registry.mjs.
 *
 * Runs before every build, and again inside content:update, so a workbook the
 * client filled in wrongly can never reach the site quietly. Errors stop the
 * build; warnings are printed and let it through.
 */
import fs from 'node:fs';
import path from 'node:path';
import { TEXT_FIELDS, SHEETS, IMAGES } from '../content/registry.mjs';

const IMG_DIR = 'public/img';
/* written by `npm run images`: every picture name the site can show */
const MANIFEST = fs.existsSync('content/images.json') ? JSON.parse(fs.readFileSync('content/images.json', 'utf8')) : {};
const GEORGIAN = /[Ⴀ-ჿᲐ-Ჿ]/;
const errors = [];
const warnings = [];
const err = (where, msg) => errors.push({ where, msg });
const warn = (where, msg) => warnings.push({ where, msg });

const file = process.argv[2] ?? 'content/site.json';
if (!fs.existsSync(file)) {
  console.error(`content:check — ${file} does not exist.`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`content:check — ${file} is not valid JSON.\n  ${e.message}`);
  process.exit(1);
}

if (data.schema !== 1) {
  err('file', `schema is ${JSON.stringify(data.schema)}, expected 1. This file was made for a different version of the site.`);
}

/* ------------------------------------------------------------------- text */
const text = data.text ?? {};
for (const f of TEXT_FIELDS) {
  const raw = text[f.path];
  const value = typeof raw === 'string' ? raw.trim() : '';
  const where = `Text › ${f.groupName} › ${f.label}`;

  if (raw === undefined) {
    err(where, `the row "${f.path}" is missing from the file entirely.`);
    continue;
  }
  if (!value && f.required !== false) {
    err(where, 'is empty, and this one cannot be left empty.');
    continue;
  }
  if (!value) continue;

  if (f.type === 'yesno' && !['yes', 'no'].includes(value.toLowerCase())) {
    err(where, `must be "yes" or "no", not "${value}".`);
  }
  if (f.type === 'choice' && !f.options.includes(value)) {
    err(where, `must be one of ${f.options.join(', ')} — not "${value}".`);
  }
  if (f.emphasis && (value.match(/\*/g) ?? []).length % 2 !== 0) {
    err(where, `has an odd number of * characters. They work in pairs: "five rooms, *none of them* finished".`);
  }
  if (value.includes('�')) {
    err(where, 'contains broken characters. The file was probably saved in the wrong encoding — re-save it as UTF-8.');
  }
  if (f.path.endsWith('.ka') || f.path === 'brand.nameGeorgian') {
    if (!GEORGIAN.test(value)) warn(where, `does not contain any Georgian letters ("${value}"). Was it typed over, or lost when the file was saved?`);
  }
}

for (const key of Object.keys(text)) {
  if (!TEXT_FIELDS.some((f) => f.path === key)) warn('Text', `"${key}" is in the file but the site does not use it. It will be ignored.`);
}

/* ------------------------------------------------------------------ lists */
for (const sheet of SHEETS) {
  const rows = data[sheet.key];
  if (!Array.isArray(rows)) {
    err(sheet.name, 'is missing from the file.');
    continue;
  }
  if (rows.length === 0) warn(sheet.name, 'has no rows. That section will be empty on the site.');

  rows.forEach((row, i) => {
    const where = `${sheet.name} › row ${i + 2}`;
    for (const col of sheet.columns) {
      const value = String(row[col.key] ?? '').trim();
      if (!value) {
        if (col.required) err(where, `"${col.header}" is empty, and it cannot be.`);
        continue;
      }
      if (col.choices && !col.choices.includes(value)) {
        err(where, `"${col.header}" must be one of ${col.choices.join(', ')} — not "${value}".`);
      }
      if (value.includes('�')) err(where, `"${col.header}" contains broken characters — re-save the file as UTF-8.`);
      if (col.key === 'ka' || col.key === 'categoryKa') {
        if (!GEORGIAN.test(value)) warn(where, `"${col.header}" has no Georgian letters ("${value}").`);
      }
      if (col.image) checkImage(where, `"${col.header}"`, value, row.imageAlt);
    }
  });
}

/* menus need at least one category with one dish */
const menu = data.menu ?? [];
const cats = new Set(menu.map((r) => String(r.category ?? '').trim()).filter(Boolean));
if (cats.size === 0) err('Menu', 'has no categories, so the menu section will be blank.');

/* ----------------------------------------------------------------- images */
function checkImage(where, what, name, alt) {
  const entry = MANIFEST[name];
  if (!entry) {
    const known = Object.keys(MANIFEST).join(', ');
    err(where, `${what} names "${name}", but there is no picture by that name. The pictures are: ${known}.`);
    return;
  }
  const missing = entry.widths.map((w) => `${name}-${w}.webp`).filter((f) => !fs.existsSync(path.join(IMG_DIR, f)));
  if (missing.length) err(where, `${what} "${name}" is missing ${missing.join(', ')} — run "npm run images".`);
  if (!String(alt ?? '').trim()) {
    warn(where, `${what} has a picture but no description. Blind visitors and Google both read that description.`);
  }
}

for (const slot of IMAGES) {
  const pic = (data.images ?? {})[slot.key];
  const where = `Images › ${slot.where}`;
  if (!pic || !String(pic.file ?? '').trim()) {
    err(where, 'has no file name. Every picture slot needs one.');
    continue;
  }
  /* the share preview is only ever read by other websites, which want a jpg */
  if (slot.key === 'og') {
    if (!fs.existsSync(path.join(IMG_DIR, String(pic.file).trim()))) err(where, `names "${pic.file}", but there is no such file in ${IMG_DIR}/.`);
    continue;
  }
  checkImage(where, 'the picture', String(pic.file).trim(), pic.alt);
}

/* ----------------------------------------------------------------- report */
const label = (list, word) => `${list.length} ${word}${list.length === 1 ? '' : 's'}`;
for (const w of warnings) console.log(`  ⚠ ${w.where} — ${w.msg}`);
for (const e of errors) console.log(`  ✗ ${e.where} — ${e.msg}`);

if (errors.length) {
  console.log(`\ncontent:check — ${label(errors, 'problem')} to fix${warnings.length ? `, ${label(warnings, 'warning')}` : ''}.`);
  process.exit(1);
}
const counts = SHEETS.map((s) => `${(data[s.key] ?? []).length} ${s.name.toLowerCase()}`).join(' · ');
console.log(`content:check — ✓ ${TEXT_FIELDS.length} text fields · ${counts}${warnings.length ? ` · ${label(warnings, 'warning')}` : ''}`);
