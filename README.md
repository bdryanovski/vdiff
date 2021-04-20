# Visual Diff



### Internal testing
```
tsc && node dist/cli.js --specLocation="../examples/example*.spec.js" --updateSnapshots=true
```


### Things to improve

  * SpecReporter - need to address describe block levels and display the correct indentation.
  * SpecReporter - better report at the end.
  * ImageReporter - display snapshots into single page for easily debuging
  * Provide interactive mode to update snapshots on the go.
  * Better example to handle dropdowns and show/hide elements

  * Benchmark speed and see can it be improved
  * Handle focused test and describe blocks
  * Handle animations better
  * Spec don't support TypeScript.
  * Make sure that spec don't pollute global scope


### Create Spec

Create file and start writing

Describe blocks could have this four hooks inside them

  * beforeEach - before every test
  * beforeAll - run once before any test start
  * afterEach - after every test
  * afterAll - run once at the end of the describe block

Useful for setup the test cases.

Describe are isolated and they run there own hooks and don't extend previous block. This don't mean that you could not re-share variables

```
describe('describe text', () => {
  // body of the describe and place to insert hooks.

  beforeEach(() => {

  })
})

Test are created by calling `it`

```
it('test description text' , () => {
  // body of the test
})
```

All functions could also be `async/await` if needed. This is useful for Visual Diff testing.