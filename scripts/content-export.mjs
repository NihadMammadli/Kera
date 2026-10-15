#!/usr/bin/env node
/**
 * Builds the client's workbook from content/site.json.
 *
 *   npm run content:export            → kera-content.xlsx
 *   npm run content:export -- out.xlsx
 *
 * The workbook always contains the words currently on the site, so the client
 * edits over real text rather than filling in a blank form. Everything they
 * must not change is locked; everything they may change is not.
 */
import fs from 'node:fs';
import ExcelJS from 'exceljs';
import { TEXT, TEXT_FIELDS, SHEETS, IMAGES } from '../content/registry.mjs';

const out = process.argv[2] ?? 'kera-content.xlsx';
const data = JSON.parse(fs.readFileSync('content/site.json', 'utf8'));

const INK = 'FF0F1A2E';
const CHALK = 'FFEFE5D2';
const OCHRE = 'FFC07C35';
const RULE = 'FFD9CEBB';
const SOFT = 'FFF6F1E7';

const wb = new ExcelJS.Workbook();
wb.creator = 'KERA';
wb.created = new Date();

const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
const thin = { style: 'thin', color: { argb: RULE } };
const box = { top: thin, left: thin, bottom: thin, right: thin };

function headerRow(ws, headers) {
  const row = ws.addRow(headers);
  row.height = 26;
  row.eachCell((cell) => {
    cell.font = { bold: true, size: 11, color: { argb: CHALK }, name: 'Calibri' };
    cell.fill = fill(INK);
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.border = box;
    cell.protection = { locked: true };
  });
  return row;
}

function introRow(ws, span, text) {
  const row = ws.addRow([text]);
  ws.mergeCells(row.number, 1, row.number, span);
  const cell = row.getCell(1);
  cell.font = { italic: true, size: 10, color: { argb: 'FF6B6355' } };
  cell.alignment = { wrapText: true, vertical: 'middle' };
  cell.fill = fill(SOFT);
  cell.protection = { locked: true };
  row.height = Math.max(30, Math.ceil(text.length / 110) * 15 + 12);
  return row;
}

/* ------------------------------------------------------- 1 · Read me first */
{
  const ws = wb.addWorksheet('Read me first', { properties: { tabColor: { argb: OCHRE } } });
  ws.getColumn(1).width = 118;
  const lines = [
    ['h', 'How to change the KERA website'],
    ['p', 'Everything written on the website is in this one file. Change what you want, save it, and send the file back. Nothing else is needed — the words you type here are the words that appear on the site.'],
    ['h2', 'The five things to know'],
    ['n', '1.  Only type in the white cells. The grey ones are labels and notes; they are locked so they cannot be changed by accident.'],
    ['n', '2.  Do not rename the tabs at the bottom, and do not add or remove columns. Adding and removing ROWS is fine and expected.'],
    ['n', '3.  To leave something out, clear the cell and leave it empty. The website simply leaves that part out — it never shows a blank space.'],
    ['n', '4.  Put *stars* around a few words in a heading and they turn gold and italic on the site. For example: Visit *KERA* in Brussels'],
    ['n', '5.  To start a new line inside a cell, hold Alt and press Enter.'],
    ['h2', 'The Menu tab'],
    ['n', 'One row is one dish or drink. To add one, add a row. To add a whole new category — appetizers, cocktails, anything — simply type its name in the first column, and a new tab appears on the website automatically.'],
    ['n', 'Only "Category" and "Dish" must be filled in. A dish with no Georgian name, no description or no price is fine; the website simply leaves that part out.'],
    ['n', 'Write prices however you like: 14.50, or 6.50 glass / 30.00 bottle. Do not type the € — that is set once on the Text tab.'],
    ['h2', 'Photographs'],
    ['n', 'The website cannot receive pictures through this file. To change a photo, send the new picture file by email and say which one it replaces; your developer prepares it in every size the site needs and tells you its name.'],
    ['n', 'The "Photo" columns and the Images tab hold those names (for example khinkali or terrace). Change a name only to swap in a picture you have already been given.'],
    ['n', 'Each photo is shown inside an arch, so pictures that are standing up (taller than wide) work best.'],
    ['n', 'On the Spaces tab, a space without a photo is not shown at all.'],
    ['h2', 'Before you send it back'],
    ['n', 'Save it as an Excel file (.xlsx). If you are working in Google Sheets, use File → Download → Microsoft Excel.'],
    ['n', 'Do not open this file in Word or a plain text editor — the Georgian letters will be destroyed.'],
    ['h2', 'If something looks wrong afterwards'],
    ['n', 'Nothing you type here can break the website permanently. Every change is checked before it goes live, and any earlier version can be put back in seconds. Write what you want and ask.'],
  ];
  for (const [kind, text] of lines) {
    const row = ws.addRow([text]);
    const cell = row.getCell(1);
    cell.alignment = { wrapText: true, vertical: 'top' };
    cell.protection = { locked: true };
    if (kind === 'h') {
      cell.font = { bold: true, size: 18, color: { argb: INK } };
      row.height = 34;
    } else if (kind === 'h2') {
      cell.font = { bold: true, size: 12, color: { argb: OCHRE } };
      row.height = 30;
    } else {
      cell.font = { size: 11, color: { argb: 'FF33302B' } };
      row.height = Math.max(17, Math.ceil(text.length / 105) * 15);
    }
  }
  await ws.protect('', { selectLockedCells: true, selectUnlockedCells: true });
}

/* --------------------------------------------------------------- 2 · Text */
{
  const ws = wb.addWorksheet('Text', { properties: { tabColor: { argb: INK } } });
  ws.columns = [
    { width: 34 },
    { width: 74 },
    { width: 62 },
    { width: 30, hidden: true },
  ];
  headerRow(ws, ['What to change', 'Your text', 'Notes', 'id — do not edit']);
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  for (const entry of TEXT) {
    if (entry.group) {
      const row = ws.addRow([entry.group]);
      ws.mergeCells(row.number, 1, row.number, 3);
      const cell = row.getCell(1);
      cell.font = { bold: true, size: 11, color: { argb: OCHRE } };
      cell.fill = fill(SOFT);
      cell.alignment = { vertical: 'middle' };
      cell.protection = { locked: true };
      row.height = 24;
      continue;
    }

    const value = data.text[entry.path] ?? '';
    const notes = [entry.help, entry.required === false ? 'May be left empty.' : null]
      .filter(Boolean)
      .join(' ');
    const row = ws.addRow([entry.label, value, notes, entry.path]);
    row.height = Math.max(20, Math.ceil((String(value).length + 1) / 70) * 15 + 5);

    row.getCell(1).font = { bold: true, size: 11, color: { argb: INK } };
    row.getCell(1).alignment = { vertical: 'top', wrapText: true };
    row.getCell(1).protection = { locked: true };

    const v = row.getCell(2);
    v.protection = { locked: false };
    v.alignment = { vertical: 'top', wrapText: true };
    v.border = box;
    v.font = { size: 11, color: { argb: 'FF1A1A1A' } };
    if (entry.type === 'yesno') {
      v.dataValidation = { type: 'list', allowBlank: false, formulae: ['"yes,no"'], showErrorMessage: true,
        errorTitle: 'Type yes or no', error: 'This answer has to be yes or no.' };
    }
    if (entry.type === 'choice') {
      v.dataValidation = { type: 'list', allowBlank: false, formulae: [`"${entry.options.join(',')}"`], showErrorMessage: true,
        errorTitle: 'Pick from the list', error: `Choose one of: ${entry.options.join(', ')}` };
    }

    row.getCell(3).font = { size: 10, italic: true, color: { argb: 'FF6B6355' } };
    row.getCell(3).alignment = { vertical: 'top', wrapText: true };
    row.getCell(3).protection = { locked: true };
    row.getCell(4).protection = { locked: true };
  }

  await ws.protect('', {
    selectLockedCells: true, selectUnlockedCells: true, formatCells: true,
    formatColumns: true, formatRows: true,
  });
}

/* ------------------------------------------------------- 3..7 · the lists */
for (const sheet of SHEETS) {
  const ws = wb.addWorksheet(sheet.name, { properties: { tabColor: { argb: INK } } });
  ws.columns = sheet.columns.map((c) => ({ width: c.width ?? 24 }));

  introRow(ws, sheet.columns.length, sheet.intro);
  const head = headerRow(ws, sheet.columns.map((c) => (c.required ? `${c.header} *` : c.header)));
  head.eachCell((cell, i) => {
    const col = sheet.columns[i - 1];
    const note = [col.help, col.required ? 'Must be filled in.' : null].filter(Boolean).join(' ');
    if (note) cell.note = note;
  });
  ws.views = [{ state: 'frozen', ySplit: 2 }];

  const rows = data[sheet.key] ?? [];
  for (const item of rows) {
    const row = ws.addRow(sheet.columns.map((c) => item[c.key] ?? ''));
    row.eachCell({ includeEmpty: true }, (cell, i) => {
      const col = sheet.columns[i - 1];
      cell.protection = { locked: false };
      cell.alignment = { vertical: 'top', wrapText: Boolean(col?.wrap) };
      cell.border = box;
      cell.font = { size: 11 };
      if (col?.choices) {
        cell.dataValidation = { type: 'list', allowBlank: !col.required, formulae: [`"${col.choices.join(',')}"`],
          showErrorMessage: true, errorTitle: 'Pick from the list', error: `Choose one of: ${col.choices.join(', ')}` };
      }
    });
    row.height = Math.max(20, Math.ceil((String(item.text ?? '').length + 1) / 70) * 15 + 5);
  }

  /* room for the client to keep typing, already unlocked and validated */
  for (let i = 0; i < 15; i++) {
    const row = ws.addRow(sheet.columns.map(() => ''));
    row.eachCell({ includeEmpty: true }, (cell, ci) => {
      const col = sheet.columns[ci - 1];
      cell.protection = { locked: false };
      cell.border = box;
      cell.alignment = { vertical: 'top', wrapText: Boolean(col?.wrap) };
      if (col?.choices) {
        cell.dataValidation = { type: 'list', allowBlank: true, formulae: [`"${col.choices.join(',')}"`] };
      }
    });
  }

  await ws.protect('', {
    selectLockedCells: true, selectUnlockedCells: true, formatCells: true,
    formatColumns: true, formatRows: true, insertRows: true, deleteRows: true, sort: true,
  });
}

/* ------------------------------------------------------------- 8 · Images */
{
  const ws = wb.addWorksheet('Images', { properties: { tabColor: { argb: OCHRE } } });
  ws.columns = [{ width: 46 }, { width: 26 }, { width: 58 }, { width: 16, hidden: true }];
  introRow(ws, 3, 'The picture shown in each place, by the name your developer gave it. The description is read aloud to blind visitors and used by Google, so say what is actually in the photograph.');
  headerRow(ws, ['Where it appears', 'Picture name', 'Description of the picture', 'id']);
  ws.views = [{ state: 'frozen', ySplit: 2 }];

  for (const slot of IMAGES) {
    const pic = (data.images ?? {})[slot.key] ?? {};
    const row = ws.addRow([slot.where, pic.file ?? '', pic.alt ?? '', slot.key]);
    row.height = 30;
    row.getCell(1).font = { bold: true, size: 11, color: { argb: INK } };
    row.getCell(1).alignment = { vertical: 'top', wrapText: true };
    row.getCell(1).protection = { locked: true };
    if (slot.help) row.getCell(1).note = slot.help;
    for (const i of [2, 3]) {
      row.getCell(i).protection = { locked: false };
      row.getCell(i).border = box;
      row.getCell(i).alignment = { vertical: 'top', wrapText: true };
    }
    row.getCell(4).protection = { locked: true };
  }
  await ws.protect('', { selectLockedCells: true, selectUnlockedCells: true, formatCells: true, formatColumns: true, formatRows: true });
}

await wb.xlsx.writeFile(out);
const kb = (fs.statSync(out).size / 1024).toFixed(0);
console.log(`content:export — ✓ ${out} (${kb} KB) · ${wb.worksheets.length} sheets · ${TEXT_FIELDS.length} text fields`);
