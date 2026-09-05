/*
 * Backend lint gate.
 *
 * The backend is CommonJS and currently has no maintained ESLint toolchain of
 * its own. This keeps the check dependency-free and makes it work in CI and
 * after a clean `npm install`: every production JavaScript file is parsed by
 * the same Node.js runtime that executes the application.
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const ignoredDirectories = new Set(['node_modules', 'Testing']);
const files = [];

function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) collect(path.join(directory, entry.name));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.js')) files.push(path.join(directory, entry.name));
  }
}

collect(root);
files.sort();

const failures = [];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failures.push({ file: path.relative(root, file), output: `${result.stdout || ''}${result.stderr || ''}`.trim() });
  }
}

if (failures.length > 0) {
  console.error(`Backend lint failed: ${failures.length} file(s) contain syntax errors.`);
  for (const failure of failures) console.error(`\n${failure.file}\n${failure.output}`);
  process.exitCode = 1;
} else {
  console.log(`Backend lint passed: ${files.length} production JavaScript file(s) parsed successfully.`);
}
