import fs from 'mz/fs';
import mkdirp from 'mkdirp';
import puppeteer from 'puppeteer';
import path from 'path';
// @ts-ignore - missing d.ts
import compareImages from 'resemblejs/compareImages';
import { VisualExpectError } from './visual-error';

export interface VisualDiffSetup {
  basePath: string;
  currentPath: string;
  diffPath: string;
  updateSnapshots?: boolean;
}

let visualContext: VisualDiffSetup;

const puppetConfig: any = {
  defaultViewport: {
    width: 1240,
    height: 1600,
  },
};

const resembleConfig: any = {
  output: {
    errorColor: {
      red: 255,
      green: 0,
      blue: 255,
    },
    errorType: 'flat',
    transparency: 0.3,
    outputDiff: true,
  },
  scaleToSameSize: false,
};

const COMPARE_IMAGE_DIFF_PERCENTAGE = 0

export async function setupVisualTests(root: string, runnerOptions: VisualDiffSetup) {

  // @NOTE convert some-file.js to some-file
  const folder = path.basename(root, '.js');

  // reset and add folder .. but this could be done more elegant for sure!
  visualContext = {
    ...runnerOptions,
    basePath: path.join(runnerOptions.basePath, folder),
    currentPath: path.join(runnerOptions.currentPath, folder),
    diffPath: path.join(runnerOptions.diffPath, folder),
  }

  // Drop current and diff folder for every run
  await fs.rmdir(visualContext.currentPath, { recursive: true });
  await fs.rmdir(visualContext.diffPath, { recursive: true });

  // Make sure that we got folders to put the images later on.
  mkdirp(visualContext.basePath);
  mkdirp(visualContext.currentPath);
  mkdirp(visualContext.diffPath);
}

export async function close(entity: any) {
  if (entity && entity.close) {
    await entity.close();
  }
  entity = undefined;
  return;
}

/**
 * By default browser is incognito page - but we could always use normal one
 * The reason for that is that we don't want to have issues with sessions
 * and cookies and so on...
 */
export async function createBrowser(incognito = true) {
  // @TODO need to let people change puppetConfig - not sure why?
  const puppy = await puppeteer.launch(puppetConfig);
  if (!incognito) {
    return puppy;
  }
  return await puppy.createIncognitoBrowserContext();
}

export async function goto(url: string, puppet: any) {
  const page = await puppet.newPage();
  await page.goto(url, { waitUntil: ['load', 'domcontentloaded'] });

  return page;
}

export async function emptyPage(puppet: any) {
  try {
    return await puppet.newPage();
  } catch (failToCreatePage) {
    throw new Error('Fail to create empty page');
  }
}

export async function Screenshot(
  params: { name: string, selector?: any; },
  page: any,
  // By default read global prop, but could be change if needed
  overwrite = visualContext.updateSnapshots
): Promise<string> {

  const imageName = anyToImageName(params.name);

  // Time to disabled animations - do it by default
  // @NOTE this will be done on every screenshot so could be optimize to be execute only once
  // @NOTE some animation still run - not sure why?
  await page.addStyleTag({
    content: `
      *,
      *::after,
      *::before {
          transition-delay: 0s !important;
          transition-duration: 0s !important;
          animation-delay: -0.0001s !important;
          animation-duration: 0s !important;
          animation-play-state: paused !important;
          caret-color: transparent !important;
          color-adjust: exact !important;
      }
    `,
  });

  if (params.selector) {
    await page.waitForSelector(params.selector);
    const selectorDOM = await page.$(params.selector);
    const clipZone = await selectorDOM.boundingBox();
    await page.screenshot({
      path: path.join(visualContext.currentPath, imageName),
      clipZone
    });
  } else {
    // Fullscreen page
    await page.screenshot({
      path: path.join(visualContext.currentPath, imageName),
      fullPage: true
    });
  }

  /**
   * If image is not part of the base images just move it there
   */
  await isImageInBase(imageName, overwrite);

  return imageName;
}

export async function CompareSnapshots(imageA: string, imageB: string, options: any = {}) {
  const diff = await compareImages(
    imageA,
    imageB,
    {
      ...resembleConfig,
      ...{
        ignoreBoxes: options.ignoreBoxes || [],
      }
    }
  );

  return diff;
}

/**
 * Helper functions
 */

function anyToImageName(url: string): string {
  let s = url;
  s = s.replace(/[^\w\s-]/g, '--').trim().toLowerCase();
  s = s.replace(/[-\s]+/g, '-');
  return `${s}.png`;
}

async function isImageInBase(image: string, overwrite = false) {
  if (!fs.existsSync(path.join(visualContext.basePath, image)) || overwrite === true) {
    await fs.copyFileSync(
      path.join(visualContext.currentPath, image),
      path.join(visualContext.basePath, image)
    );
    return;
  }
}

export async function createDiffImage(buffer: any, name: string) {
  await fs.writeFile(path.join(visualContext.diffPath, name), buffer);
}

export async function imageFrom(name: string, type: "base" | "diff" | "current"): Promise<any> {
  const f = {
    base: visualContext.basePath,
    current: visualContext.currentPath,
    diff: visualContext.diffPath
  };
  return await fs.readFile(path.join(f[type], name));
}

export async function expectToMatchBase(testCondition: string) {
  // testCondition must be image name.
  const sideA = await imageFrom(testCondition as string, 'base');
  const sideB = await imageFrom(testCondition as string, 'current');

  const diff = await CompareSnapshots(sideA, sideB);

  if (diff.rawMisMatchPercentage > COMPARE_IMAGE_DIFF_PERCENTAGE) {
    await createDiffImage(diff.getBuffer(), testCondition)
    throw new VisualExpectError(
      `Screenshot don't match with base image: ${diff.misMatchPercentage}% miss-match\n`,
      {
        diff: { ...diff },
        basePath: path.join(visualContext.basePath, testCondition),
        currentPath: path.join(visualContext.currentPath, testCondition),
        diffImage: path.join(visualContext.diffPath, testCondition)
      }
    );
  }
}

/** attach to global object */
global.VisualDiff = {
  createBrowser: createBrowser,
  Screenshot: Screenshot,
  goto: goto,
  close: close,
  emptyPage: emptyPage,
  expectToMatchBase: expectToMatchBase
};