const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const testRoot = path.join(root, 'test');

// Discover every test file so payment/webhook integration coverage is not
// silently omitted when it is present. With no local tests, Node's test
// runner still exits successfully and the lint gate remains useful on a
// clean checkout.
function collectTests(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectTests(file);
    return entry.isFile() && /\.test\.(?:c|m)?js$/.test(entry.name) ? [file] : [];
  });
}

const testFiles = collectTests(testRoot).sort();
const args = testFiles.length > 0 ? ['--test', ...testFiles] : ['--test'];
const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exitCode = result.status ?? 1;
