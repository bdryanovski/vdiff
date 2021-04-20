/**
 * Test multi level describe blocks
 */
describe('Describe level 1', () => {

  let a = 0;

  beforeAll(() => {
    a = 1;
  })

  beforeEach(() => {
    a = 1
  })

  afterEach(() => {
  })

  afterAll(() => {
  })

  it('Describe level 1 - first test', () => {
    a = a + 1
    expect(a).toBe(2)
  })

  it('Describe level 1 - second test', () => {
    a = a + 1;
    expect(a).toBe(2)
  })

  it('Describe level 1 - third test', () => {
    a = a + 1;
    expect(a).toBe(2)
  })

  // @TODO for some reason second level is not covered ?
  describe('Describe level 2', () => {
    let a = 1;

    it('Describe level 2 - first test', () => {
      a = a + 1;
      expect(a).toBe(2);
    });

    it('Describe level 2 - second test', () => {
      a = a + 1;
      expect(a).toBe(3);
    });

    it('Describe level 2 - third test', () => {
      a = a + 1;
      expect(a).toBe(4);
    })
  })

  describe('Describe level 2.2', () => {
    it('Describe level 2.2 - test 1', () => { })
    it('Describe level 2.2 - test 2', () => { })
    describe('Describe level 3', () => {
      it('Describe level 3 - test 1', () => { })
      it('Describe level 3 - test 2', () => { })
      describe('Describe level 4', () => {
        it('Describe level 4 - test 1', () => { });
        it('Describe level 4 - test 2', () => { });
      })
    })
  })
})