/**
 * Test visual testing
 */
const CLARITY_DESIGN_URL = process.CLARITY_DESIGN_URL || 'https://clarity.design';
const CLARITY_STORYBOOK_URL = process.CLARITY_STORYBOOK_URL || 'https://clarity.design/storybook/core/';

describe(`Clarity Design ${CLARITY_DESIGN_URL}`, () => {

  let browser, page;

  beforeAll(async () => {
    browser = await VisualDiff.createBrowser();
  })

  beforeEach(async () => {
    try {
      page = await VisualDiff.goto(CLARITY_DESIGN_URL, browser);

    } catch (e) {
      console.log(e)
    }
  })

  afterAll(async () => {
    browser.close();
  })

  afterEach(async () => {
    // page.close();
  })

  it('display and show search dialog', async () => {

    const searchId = 'input#algolia-search-input'
    const dropdownId = '#algolia-autocomplete-listbox-0'

    await page.waitForSelector(searchId)
    await page.evaluate(selector => {
      document.querySelector(selector).value = "";
    }, searchId);
    await page.type(searchId, 'combo', {delay: 1})

    await page.waitForSelector(dropdownId);

    // @NOTE need to wait a little to be sure that animation is finish.
    await page.waitForTimeout(300);

    const screenshot = await VisualDiff.Screenshot({
      name: 'open search dialog',
      selector: 'body'
    }, page)

    await VisualDiff.expectToMatchBase(screenshot)

  })

  it('second level of the sidenav', async () => {

    await page.waitForSelector('.side-nav-container');
    await page.$eval('.nav-group:nth-child(2) button', el => el.click());

    const screenshot = await VisualDiff.Screenshot({
      name: 'open second navigation branch',
      selector: 'body'
    }, page);

    await VisualDiff.expectToMatchBase(screenshot)
  })
})

describe(`Clarity Storybook ${CLARITY_STORYBOOK_URL}`, () => {

  let browser, page;

  beforeAll(async () => {
    browser = await VisualDiff.createBrowser();
  })

  afterAll(async () => {
    browser.close();
  })

  afterEach(async () => {
    page.close();
  })

  it('design tokens', async() => {

    page = await VisualDiff.goto(`${CLARITY_STORYBOOK_URL}iframe.html?id=foundation-design-tokens--page&viewMode=story`, browser);

    const screenshot = await VisualDiff.Screenshot({
      name: 'clarity storybook design token',
      // @NOTE if we don't pass selector we gonna make fullscreen snapshot
    }, page);

    await VisualDiff.expectToMatchBase(screenshot)
  })

  it('typography', async () => {

    page = await VisualDiff.goto(`${CLARITY_STORYBOOK_URL}iframe.html?id=foundation-typography--page&viewMode=story`, browser);

    const screenshot = await VisualDiff.Screenshot({
      name: 'clarity storybook typography',
    }, page);

    await VisualDiff.expectToMatchBase(screenshot);
  })

  it('object-styles', async () => {

    page = await VisualDiff.goto(`${CLARITY_STORYBOOK_URL}iframe.html?id=foundation-object-styles--page&viewMode=story`, browser);

    const screenshot = await VisualDiff.Screenshot({
      name: 'clarity storybook object-styles',
    }, page);

    await VisualDiff.expectToMatchBase(screenshot);
  })

  it('interaction-styles', async () => {

    page = await VisualDiff.goto(`${CLARITY_STORYBOOK_URL}iframe.html?id=foundation-interaction-styles--page&viewMode=story`, browser);

    const screenshot = await VisualDiff.Screenshot({
      name: 'clarity storybook interaction-styles',
    }, page);

    await VisualDiff.expectToMatchBase(screenshot);
  })

  it('spacing', async () => {

    page = await VisualDiff.goto(`${CLARITY_STORYBOOK_URL}iframe.html?id=foundation-spacing--page&viewMode=story`, browser);

    const screenshot = await VisualDiff.Screenshot({
      name: 'clarity storybook spacing',
    }, page);

    await VisualDiff.expectToMatchBase(screenshot);
  })

  it('colors', async () => {

    page = await VisualDiff.goto(`${CLARITY_STORYBOOK_URL}iframe.html?id=foundation-color--page&viewMode=story`, browser);

    const screenshot = await VisualDiff.Screenshot({
      name: 'clarity storybook colors',
    }, page);

    await VisualDiff.expectToMatchBase(screenshot);
  })

  it('grid', async () => {

    page = await VisualDiff.goto(`${CLARITY_STORYBOOK_URL}iframe.html?id=layout-grid--page&viewMode=story`, browser);

    const screenshot = await VisualDiff.Screenshot({
      name: 'clarity storybook grid',
    }, page);

    await VisualDiff.expectToMatchBase(screenshot);
  })

  it('layout spacing', async () => {

    page = await VisualDiff.goto(`${CLARITY_STORYBOOK_URL}iframe.html?id=layout-spacing--page&viewMode=story`, browser);

    const screenshot = await VisualDiff.Screenshot({
      name: 'clarity storybook layout spacing',
    }, page);

    await VisualDiff.expectToMatchBase(screenshot);
  })

  it('status', async () => {

    // @NOTE too compact maybe?
    const screenshot = await VisualDiff.Screenshot({
        name: 'clarity storybook status',
      },
      await VisualDiff.goto(
        `${CLARITY_STORYBOOK_URL}iframe.html?id=foundation-status--page&viewMode=story`,
        browser
      )
    );

    await VisualDiff.expectToMatchBase(screenshot);
  })
})