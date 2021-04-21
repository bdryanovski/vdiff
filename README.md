# Visual Diff

`vdiff` is a visual testing tool design to compare pages for visual changes over time.

## First run

Install node modules.
```bash
yarn install
```

Build it
```bash
yarn build
```

Link to global commands list
```bash
yarn link
```
After that you could use it as normal command `vdiff`.


## Things to improve

  * SpecReporter - need to address describe block levels and display the correct indentation.
  * SpecReporter - better report at the end.
  * ImageReporter - display snapshots into single page for easily debugging
  * Provide interactive mode to update snapshots on the go.
  * Better example to handle dropdowns and show/hide elements

  * Benchmark speed and see can it be improved
  * Handle focused test and describe blocks
  * Handle animations better
  * Spec don't support TypeScript.
  * Make sure that spec don't mess with global scope

## Known issues

  * Could not focus Describe blocks or Tests at the moment - work in progress
  * You need to have a root Describe block. Detached test could have strange behavior. - planned fix.

## Usage

Default file naming is `<target>.vspec.js`, but in the end - it depends on you. `*.vspec.js` is used so no conflict with other specs will be made.

Describe blocks could have this four hooks inside them

  * beforeEach - before every test
  * beforeAll - run once before any test start
  * afterEach - after every test
  * afterAll - run once at the end of the describe block

Useful for setup the test cases, cleanup after test or handle duplicate code that need to be re-run for before/after tests.

Describe are isolated and they run there own hooks and don't extend previous block. This don't mean that you could not re-share variables.

```js
describe('describe text', () => {
  // body of the describe and place to insert hooks.
  beforeEach(() => {

  })

  // tests...
})
```

Test are created by calling `it`

```js
it('test description text' , () => {
  // body of the test
})
```

All functions could also be `async/await` if needed. This is useful for Visual Diff testing.

Visiting a page and making screenshot:

```js
// @INFO Create test block that could be focused/ignored and have it's own run scope.
describe(`Localhost`, () => {

  // Global variables for the Describe block.
  let browser, page;

  // Before all test
  beforeAll(async () => {
    // Create a Browser instance
    browser = await VisualDiff.createBrowser();
  });

  // After the block ends
  afterAll(async () => {
    // Close the Browser that we created and release the memory.
    browser.close();
  });

  // After each test finish
  afterEach(async () => {
    // Close the open page
    // @IMPORTANT if we don't close the open pages we could easily hit memory limit
    page.close();
  });

  // Simple test
  it('open page and screenshot it', async () => {

    // Create new page and open given URL inside the Browser instance.
    page = await VisualDiff.goto('http://localhost', browser);

    // Screenshot the full page and name the file `localhost-page.png`
    const screenshot = await VisualDiff.Screenshot({ name: 'localhost-page' }, page);
    // Compare the screenshot that we made with previous version
    // If this is the first time for this screenshot mark it as a base image for the nest run
    await VisualDiff.expectToMatchBase(screenshot);
  });

});
```

Click on an element

```js
const linkId = 'a.active-link'

// Make sure the link is render
await page.waiteForSelector(linkId)
// find and click
await page.$eval(linkId, (el) => el.click())
```

Dropdowns and animations

```js
// Use waitForTimeout to wait until the animation is finish. To be on the save side use something
// between 250-300ms. Things like dropdown, tabs, show and hide most of the time require some
// additional time to finish rendering.
 await page.waitForTimeout(100);
```


## Modify specs from outside.

There is a way to inject variables inside the specs from outside.

```bash
CLARITY_DESIGN_URL="http://localhost:8080" vdiff --specs="../specs/website*.vspec.js"
```

To create this type of arguments use the `process.env`

```js
// example.spec.js

const PRODUCTION_ADDRESS = process.env.PROD ? 'http://production.website.com' : 'http://localhost';

console.log(PRODUCTION_ADDRESS)
```

```bash
PROD=true vdiff --specs="../specs/example*.vspec.js"

// => 'http://production.website.com'
```

## Internal testing
```
tsc && node dist/cli.js --specs="./specs/example*.vspec.js" --updateSnapshots=true
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.