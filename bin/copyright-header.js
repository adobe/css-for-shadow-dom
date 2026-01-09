#!/usr/bin/env node
/*
 * Copyright 2026 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at <http://www.apache.org/licenses/LICENSE-2.0>
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * Copyright 2026 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at <http://www.apache.org/licenses/LICENSE-2.0>
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * Copyright 2026 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at <http://www.apache.org/licenses/LICENSE-2.0>
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * copyright-header.js
 *
 * Usage:
 *   node bin/copyright-header.js
 *
 * Defaults:
 *   headerFilePath: ./COPYRIGHT
 *   rootPath: .
 *
 * Features:
 * - Recursively visits files under rootPath
 * - Only processes .js, .css, .liquid, .md files
 * - Skips node_modules, .git, and hidden folders
 * - Inserts header (wrapped in appropriate comment syntax) only if the header
 *   content does not already appear in the file.
 * - Handles shebang (#!) lines and CSS @charset special case
 */

import { promises as fs } from 'fs';
import path from 'path';

const HEADER_DEFAULT = './COPYRIGHT';
const ROOT_DEFAULT = '.';
const IGNORE_DIRS = new Set(['node_modules', '.git']);
const IGNORE_FILES = new Set(['README.md', 'CODE_OF_CONDUCT.md', 'prism.css']);

const targetExtensions = new Set(['.js', '.css', '.liquid', '.md']);

function errorExit(msg) {
  if (msg) console.error(msg);
  process.exit(msg ? 1 : 0);
}

function updateHeaderYear(content) {
  // Match like "Copyright 2025 Adobe"
  const regex = /Copyright\s+(\d{4})\sAdobe/;
  let updated = false;

  const currentYear = new Date().getFullYear();
  const result = content.replace(regex, (match, year) => {
    if (parseInt(year, 10) !== currentYear) {
      updated = true;
      return `Copyright ${currentYear} Adobe`;
    }
    return match;
  });

  return { content: result, updated };
}

function wrapHeaderForExt(ext, header) {
  const trimmed = header.replace(/\r\n/g, '\n').trim();
  // Use block comment with a leading star on every line (conventional)
  const lines = trimmed
    .split('\n')
    .map((l) => ` * ${l}`)
    .join('\n');

  if (ext === '.js') {
    // JS comment
    return `/*\n${lines}\n */\n\n`;
  } else if (ext === '.css') {
    // CSS block comment
    return `/*\n${lines}\n */\n\n`;
  } else if (ext === '.liquid') {
    // Liquid template comment
    return `{% comment %}\n/*\n${lines}\n*/\n{% endcomment %}\n`;
  } else if (ext === '.md') {
    // Markdown templates comment
    return `<!--\n/*\n${lines}\n*/\n-->\n`;
  } else {
    throw new Error('Unsupported extension: ' + ext);
  }
}

function normalizeForComparison(s) {
  if (!s) return '';
  return (
    s
      // normalize newlines
      .replace(/\r\n/g, '\n')
      // remove block/HTML comment delimiters
      .replace(/\/\*|\*\/|<!--|-->/g, ' ')
      // remove common line comment markers (e.g., //) and leading '*' used in boxed comments
      .replace(/(^|\n)\s*[*\/]{0,2}\s*/g, '$1')
      // remove shebang marker if present
      .replace(/#!+/g, ' ')
      // remove stray punctuation that commonly varies, keep alphanumerics and whitespace
      .replace(/[^\w\s\-.,:;()/@]+/g, ' ')
      // collapse whitespace
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
  );
}

async function walkDir(root, onFile) {
  const stack = [path.resolve(root)];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = await fs.readdir(cur, { withFileTypes: true });
    } catch (err) {
      console.warn(`Skipping unreadable directory: ${cur} (${err.message})`);
      continue;
    }
    for (const dirent of entries) {
      const name = dirent.name;
      if (dirent.isDirectory()) {
        if (IGNORE_DIRS.has(name) || name.startsWith('.')) continue;
        stack.push(path.join(cur, name));
      } else if (dirent.isFile()) {
        if (IGNORE_FILES.has(name)) continue; // skip specific files
        await onFile(path.join(cur, name));
      }
    }
  }
}

async function processFile(filePath, headerPlain, headerWrappedByExt, normalizedWrappedHeader) {
  const ext = path.extname(filePath).toLowerCase();
  if (!targetExtensions.has(ext)) return { skipped: true, reason: 'not-target' };

  let content;
  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    return { skipped: true, reason: 'read-error', err };
  }

  // File already has header — try updating year
  const { content: updatedContent, updated } = updateHeaderYear(content);
  if (updated) {
    await fs.writeFile(filePath, updatedContent, 'utf8');
    return { skipped: false, reason: 'updated-year' };
  }

  const normalizedContent = normalizeForComparison(content);

  // Use the wrapped/normalized header for this file extension
  const normalizedHeaderForThisExt = normalizedWrappedHeader[ext] || normalizeForComparison(headerPlain);

  if (normalizedContent.includes(normalizedHeaderForThisExt)) {
    return { skipped: true, reason: 'already-has-header' };
  }

  // Prepare insertion point: handle shebang and CSS @charset rules
  let newContent = content;
  const wrappedHeader = headerWrappedByExt[ext] ?? wrapHeaderForExt(ext, headerPlain);

  // If file starts with a shebang, preserve it as first line
  if (content.startsWith('#!')) {
    const firstNewline = content.indexOf('\n');
    if (firstNewline === -1) {
      // single-line shebang-only file; append header after
      newContent = content + '\n' + wrappedHeader;
    } else {
      const shebangLine = content.slice(0, firstNewline + 1);
      const rest = content.slice(firstNewline + 1);
      newContent = shebangLine + wrappedHeader + rest;
    }
  } else if (ext === '.css') {
    // If CSS file has @charset "..."; as first token, preserve it at top (must be first).
    const charsetMatch = /^\s*@charset\s+[^;]+;/i.exec(content);
    if (charsetMatch && content.indexOf(charsetMatch[0]) === 0) {
      const charsetLine = charsetMatch[0] + (content[charsetMatch[0].length] === '\n' ? '\n' : '\n');
      const rest = content.slice(charsetLine.length);
      newContent = charsetLine + wrappedHeader + rest;
    } else {
      newContent = wrappedHeader + content;
    }
  } else if (ext === '.liquid' || ext === '.md') {
    // Detect YAML front matter block at the top of the file
    const frontMatterMatch = content.match(/^---\s*\n[\s\S]*?\n---\s*\n?/);
    if (frontMatterMatch && frontMatterMatch.index === 0) {
      const frontMatter = frontMatterMatch[0];
      const rest = content.slice(frontMatter.length);
      newContent = frontMatter + wrappedHeader + rest;
    } else {
      newContent = wrappedHeader + content;
    }
  } else {
    // default insertion at top
    newContent = wrappedHeader + content;
  }

  try {
    await fs.writeFile(filePath, newContent, 'utf8');
  } catch (err) {
    return { skipped: true, reason: 'write-error', err };
  }

  return { skipped: false };
}

async function main() {
  const headerPath = HEADER_DEFAULT;
  const rootPath = ROOT_DEFAULT;

  // Read header file
  let headerPlain;
  try {
    headerPlain = await fs.readFile(headerPath, 'utf8');
  } catch (err) {
    errorExit(`Could not read header file at "${headerPath}": ${err.message}`);
  }
  if (!headerPlain.trim()) {
    errorExit('Header file is empty.');
  }

  // Precompute wrapped forms for ext to avoid re-wrapping
  const headerWrappedByExt = {
    '.js': wrapHeaderForExt('.js', headerPlain),
    '.css': wrapHeaderForExt('.css', headerPlain),
    '.liquid': wrapHeaderForExt('.liquid', headerPlain),
    '.md': wrapHeaderForExt('.md', headerPlain),
  };

  const normalizedWrappedHeader = {
    '.js': normalizeForComparison(headerWrappedByExt['.js']),
    '.css': normalizeForComparison(headerWrappedByExt['.css']),
    '.liquid': normalizeForComparison(headerWrappedByExt['.liquid']),
    '.md': normalizeForComparison(headerWrappedByExt['.md']),
  };

  let processed = 0;
  let inserted = 0;
  let skipped = 0;
  let errors = [];

  await walkDir(rootPath, async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!targetExtensions.has(ext)) return;
    processed++;
    const res = await processFile(filePath, headerPlain, headerWrappedByExt, normalizedWrappedHeader);
    if (res.skipped) {
      skipped++;
    } else {
      inserted++;
    }
    if (res.err) {
      errors.push({ file: filePath, err: res.err, reason: res.reason });
    }
  });

  console.log('--- add-header summary ---');
  console.log(`Header source: ${path.resolve(headerPath)}`);
  console.log(`Root walked: ${path.resolve(rootPath)}`);
  console.log(`Files scanned (target extensions): ${processed}`);
  console.log(`Headers inserted: ${inserted}`);
  console.log(`Files skipped (already had header or not applicable): ${skipped}`);
  if (errors.length) {
    console.log(`Errors: ${errors.length}`);
    errors.slice(0, 10).forEach((e) => {
      console.error(`  ${e.file}: ${e.reason} ${e.err ? '- ' + e.err.message : ''}`);
    });
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
