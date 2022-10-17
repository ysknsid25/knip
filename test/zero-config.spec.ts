import test from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { main } from '../src';

test('Find unused files and exports', async () => {
  const workingDir = path.resolve('test/fixtures/zero-config');

  const { issues, counters } = await main({
    cwd: workingDir,
    workingDir,
    include: [],
    exclude: [],
    ignore: [],
    gitignore: false,
    isIncludeEntryFiles: true,
    isDev: false,
    isShowProgress: false,
    jsDoc: [],
    debug: {
      isEnabled: false,
      level: 0,
    },
  });

  assert.equal(issues.files.size, 0);

  assert.equal(Object.values(issues.exports).length, 2);
  assert.equal(issues.exports['dep.ts']['unused'].symbol, 'unused');
  assert.equal(issues.exports['index.ts']['b'].symbol, 'b');

  assert(Object.values(issues.types).length === 1);
  assert(issues.types['dep.ts']['Dep'].symbolType === 'type');

  assert(Object.values(issues.nsExports).length === 1);
  assert(issues.nsExports['ns.ts']['z'].symbol === 'z');

  assert(Object.values(issues.nsTypes).length === 1);
  assert(issues.nsTypes['ns.ts']['NS'].symbol === 'NS');

  assert(Object.values(issues.duplicates).length === 1);
  assert(issues.duplicates['dep.ts']['dep|default'].symbols?.[0] === 'dep');

  assert.deepEqual(counters, {
    dependencies: 0,
    devDependencies: 0,
    duplicates: 1,
    exports: 2,
    files: 0,
    nsExports: 1,
    nsTypes: 1,
    processed: 3,
    types: 1,
    unresolved: 0,
  });
});
