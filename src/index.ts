import glob from 'glob';
import path from 'path';
import { Context } from './context';

/**
 * Pollute everything with global assignment and local
 * variables - but it's quick and it works.
 */
import './runner';
import { runSpec } from './runner';
import { SpecReporter } from './reporters/specReporter';
import { DotReporter } from './reporters/dotReporter';

/**
 * Import visual methods
 */
import './visual/visual'
import { setupVisualTests } from './visual/visual';

export const defaultOptions = {
  specLocation: './**/*.spec.js',
  reporter: 'spec',
  updateSnapshots: false,
  basePath: './images/base',
  currentPath: './images/current',
  diffPath: './images/diff',
  showBanner: true,
}

export async function run(userOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };
  const initialTime = new Date().getTime();

  const specReports: any[] = [];

  const files = glob.sync(path.join(__dirname, options.specLocation))

  const filesLength = files.length;
  /** Every spec files is it's own run  */
  for (let fileIndex = 0; fileIndex < filesLength; fileIndex++) {

    const specName = files[fileIndex];
    const ctx = new Context(specName, options);

    ctx.reporter = (options.reporter === 'spec')
      ? new SpecReporter()
      : new DotReporter();

    await setupVisualTests(ctx.filename, {
      basePath: options.basePath,
      currentPath: options.currentPath,
      diffPath: options.diffPath,
      updateSnapshots: options.updateSnapshots,
    });
    await runSpec(ctx)

    specReports.push({ spec: specName, reporter: ctx.reporter });
  }

  specReports.forEach((result: any) => {
    console.log("\n" + result.spec)
    result.reporter.report()
  })

  console.log(`Done. (${(new Date().getTime() - initialTime) / 1000} s)`)

  // make sure to quit
  process.exitCode = 0;
  process.exit()
}
