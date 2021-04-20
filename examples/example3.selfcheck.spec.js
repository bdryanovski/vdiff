const {Context} = require('../dist/context');

const FILENAME = 'fake-filename.js'

/**
 * basic test to test itself - full loop
 */
describe('Self check', () => {

  describe('Context', () => {

    it('should have context object and get filename', () => {
      const c = new Context(FILENAME, {});
      expect(c.filename).toBe(FILENAME);
    });

    it('should let you add describe block and read it later', () => {
      const BLOCK_NAME = 'demo block';

      const c = new Context(FILENAME, {});

      c.addDescribe(BLOCK_NAME, () => { });

      const tree = c.workTree;

      expect(tree.id).toBe(1);
      expect(tree.content.name).toBe(BLOCK_NAME);
      expect(tree.left).toBe(null);
      expect(tree.right).toBe(null);
    });

    it('should get a list of blocks', () => {
      const BLOCK_NAME = 'demo block';
      const TEST_NAME = 'demo test';

      const c = new Context(FILENAME, {});

      c.addDescribe(BLOCK_NAME, () => { });
      c.addTest(TEST_NAME, () => { });

      expect(c.blocks[0].id).toBe(1);
      expect(c.blocks[0].name).toBe(BLOCK_NAME);
      expect(c.blocks[0].tests[0].name).toBe(TEST_NAME);
    });

    it('should let you register hooks to block', () => {
      const BLOCK_NAME = 'demo block';

      const c = new Context(FILENAME, {});
      c.addDescribe(BLOCK_NAME, () => { });

      c.hooks('afterAll', () => { });
      c.hooks('beforeAll', () => { });
      c.hooks('afterEach', () => { });
      c.hooks('beforeEach', () => { });

      expect(c.blocks[0].hooks).toBeArrayWithLength(4);
      expect(c.blocks[0].hooks[0].name).toBe('afterAll');
      expect(c.blocks[0].hooks[1].name).toBe('beforeAll');
      expect(c.blocks[0].hooks[2].name).toBe('afterEach');
      expect(c.blocks[0].hooks[3].name).toBe('beforeEach');
    })
  })

})